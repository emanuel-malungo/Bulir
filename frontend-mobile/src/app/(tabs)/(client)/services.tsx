import ScheduleServiceModal from "@/components/modals/ScheduleServiceModal";
import { useCreateReservation } from "@/modules/reservation/useReservation";
import type { IServiceListItem } from "@/modules/service/service.types";
import { useInfiniteServices } from "@/modules/service/useService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 8;

export default function ServicesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<IServiceListItem | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteServices({ search: searchQuery }, ITEMS_PER_PAGE);

  const createReservationMutation = useCreateReservation();

  const allServices = data?.pages.flatMap((page) => page?.data || []) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSchedulePress = (service: IServiceListItem) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleScheduleConfirm = async (scheduleData: {
    date: string;
    time: string;
  }) => {
    if (!selectedService) {
      Alert.alert("Erro", "Serviço não encontrado");
      return;
    }

    try {
      const scheduledAt = `${scheduleData.date}T${scheduleData.time}:00Z`;

      await createReservationMutation.mutateAsync({
        serviceId: selectedService.id,
        providerId: selectedService.providerId,
        scheduledAt,
      });

      Alert.alert("Sucesso", "Serviço agendado com sucesso!");
      setModalVisible(false);
      setSelectedService(null);
    } catch (err: any) {
      let errorMessage = "Falha ao agendar o serviço";
      if (Array.isArray(err) && err[0]?.message) {
        errorMessage = err[0].message;
      } else if (err?.issues && Array.isArray(err.issues) && err.issues[0]?.message) {
        errorMessage = err.issues[0].message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      Alert.alert("Erro ao agendar", errorMessage);
    }
  };

  const renderServiceCard = ({ item }: { item: IServiceListItem }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm shadow-black/5 mb-4"
      style={{ width: "48%" }}
    >
      <View className="p-5">
        {/* Category/Badge Icon Area */}
        <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center mb-4">
           <Ionicons name="sparkles" size={24} color="#31ECC6" />
        </View>

        {/* Service Info */}
        <Text className="text-[#0C2340] text-sm font-black italic uppercase leading-tight mb-1" numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="text-gray-400 text-[10px] font-bold uppercase mb-4" numberOfLines={1}>
          {item.provider?.fullName || "Provedor"}
        </Text>

        <View className="flex-row items-center justify-between mb-5 pt-3 border-t border-gray-50">
           <Text className="text-[#0C2340] font-black text-xs">
             Kz {Number(item.price).toLocaleString("pt-AO")}
           </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => handleSchedulePress(item)}
          className="bg-[#0C2340] py-3 rounded-2xl items-center flex-row justify-center gap-2"
          activeOpacity={0.8}
        >
          <Ionicons name="calendar" size={14} color="#31ECC6" />
          <Text className="text-white font-black uppercase text-[9px] tracking-widest">Agendar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderLoadingFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#31ECC6" />
      </View>
    );
  };

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <StatusBar barStyle="dark-content" backgroundColor="white" translucent />
        <View className="w-20 h-20 bg-red-50 rounded-[30px] items-center justify-center mb-6">
          <Ionicons name="alert-circle" size={40} color="#ef4444" />
        </View>
        <Text className="text-[#0C2340] text-2xl font-black uppercase italic tracking-tighter text-center">
          Ops! Algo deu errado
        </Text>
        <Text className="text-gray-400 text-sm mt-2 text-center font-medium">
          {error instanceof Error ? error.message : "Não conseguimos carregar os serviços agora."}
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mt-10 w-full py-5 bg-[#0C2340] rounded-[24px] items-center"
        >
          <Text className="text-white font-black uppercase text-xs tracking-widest">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent />

      {/* Header Premium */}
      <View className="px-6 py-6 pb-2 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center bg-white shadow-sm"
        >
          <Ionicons name="chevron-back" size={24} color="#0C2340" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-gray-400 text-[8px] font-black uppercase tracking-[4px] mb-1">
            Explore Agora
          </Text>
          <Text className="text-[#0C2340] text-2xl font-black italic tracking-tighter uppercase">
            Serviços
          </Text>
        </View>
        <View className="w-10" />
      </View>

      {/* Search Bar Minimalista */}
      <View className="px-6 my-4">
        <View className="flex-row items-center bg-white border border-gray-50 rounded-[24px] px-6 h-14 shadow-sm shadow-black/5 gap-3">
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            placeholder="O que você está procurando?"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-[#0C2340] font-medium text-sm"
          />
        </View>
      </View>

      {isLoading && !isFetchingNextPage ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#31ECC6" />
          <Text className="text-gray-400 text-[10px] font-black uppercase mt-4 tracking-widest">
            Buscando serviços...
          </Text>
        </View>
      ) : (
        <FlatList
          data={allServices}
          renderItem={renderServiceCard}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          columnWrapperStyle={{
            paddingHorizontal: 20,
            justifyContent: "space-between",
          }}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20 px-10">
              <View className="w-20 h-20 bg-gray-100 rounded-[30px] items-center justify-center mb-6">
                <Ionicons name="layers-outline" size={40} color="#d1d5db" />
              </View>
              <Text className="text-[#0C2340] text-xl font-black uppercase italic tracking-tighter text-center">
                Sem correspondências
              </Text>
              <Text className="text-gray-400 text-xs mt-2 font-bold tracking-widest uppercase text-center">
                Tente ajustar sua busca para encontrar o que precisa
              </Text>
            </View>
          }
          ListFooterComponent={renderLoadingFooter}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ScheduleServiceModal
        visible={modalVisible}
        service={selectedService}
        onClose={() => setModalVisible(false)}
        onConfirm={handleScheduleConfirm}
        isLoading={createReservationMutation.isPending}
      />
    </SafeAreaView>
  );
}
