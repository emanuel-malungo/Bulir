import ScheduleServiceModal from "@/components/modals/ScheduleServiceModal";
import { useCreateReservation } from "@/modules/reservation/useReservation";
import type { IServiceListItem } from "@/modules/service/service.types";
import { useInfiniteServices } from "@/modules/service/useService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 6;

export default function ServicesScreen() {
  const router = useRouter();
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
  } = useInfiniteServices({}, ITEMS_PER_PAGE);

  const createReservationMutation = useCreateReservation();

  // Combina todas as páginas em um array linear
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
      // Combinar data e hora para criar datetime no formato ISO 8601 com Z (UTC)
      // date vem como "YYYY-MM-DD" e time como "HH:mm"
      // Formato esperado: "YYYY-MM-DDTHH:mm:ssZ"
      const scheduledAt = `${scheduleData.date}T${scheduleData.time}:00Z`;

      console.log("Agendamento confirmado:", {
        service: selectedService,
        schedule: scheduleData,
        scheduledAt,
      });

      // Chamar API para criar reserva
      await createReservationMutation.mutateAsync({
        serviceId: selectedService.id,
        providerId: selectedService.provider.id,
        scheduledAt,
      });

      Alert.alert("Sucesso", "Serviço agendado com sucesso!");
      setModalVisible(false);
      setSelectedService(null);
    } catch (err: any) {
      console.error("Erro ao agendar reserva:", err);
      
      // Extrair mensagem do erro - pode ser ZodError ou array de validações
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
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      style={{ width: "48%" }}
    >
      {/* Card Content */}
      <View className="px-4 py-3">
        {/* Service Name & Active Badge */}
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 pr-2">
            <Text className="text-sm font-bold text-gray-900 leading-5">
              {item.name}
            </Text>
          </View>
          {item.isActive && (
            <View className="bg-green-50 px-2 py-1 rounded-md">
              <Text className="text-green-600 text-xs font-bold">Ativo</Text>
            </View>
          )}
        </View>

        {/* Provider */}
        <View className="flex-row items-center gap-1 mb-2">
          <Ionicons name="person" size={12} color="#9CA3AF" />
          <Text className="text-gray-600 text-xs">
            {item.provider?.fullName || "Sem provider"}
          </Text>
        </View>

        {/* Description */}
        <Text className="text-gray-600 text-xs mb-2 leading-4">
          {item.description}
        </Text>

        {/* Divider */}
        <View className="border-b border-gray-100 mb-2" />

        {/* Price */}
        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons name="pricetag" size={12} color="#31ECC6" />
          <Text className="font-bold text-[#31ECC6] text-xs">
            Kz {typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
          </Text>
        </View>

        {/* Agendar Button */}
        <TouchableOpacity
          onPress={() => handleSchedulePress(item)}
          
          className="rounded-lg overflow-hidden"
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#31ECC6", "#1aa89a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-2 items-center"
          >
            <Text className="text-white font-bold text-xs">Agendar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderLoadingFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="large" color="#31ECC6" />
      </View>
    );
  };

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 text-sm mt-1">
          {error instanceof Error ? error.message : "Erro desconhecido"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#31ECC6" translucent />

      {/* Header */}
      <View className="px-6 pt-6 pb-6">
        <View className="flex-row items-center gap-3 mb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-900">Serviços</Text>
        </View>
        <Text className="text-gray-500 text-sm ml-10">
          Conheça os serviços disponíveis
        </Text>
      </View>

      {/* Services Grid with Infinite Scroll */}
      <FlatList
        data={allServices}
        renderItem={renderServiceCard}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginBottom: 12,
          gap: 12,
        }}
        contentContainerStyle={{ paddingBottom: 32 }}
        scrollIndicatorInsets={{ right: 1 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center py-12">
              <Ionicons name="layers-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 font-semibold mt-4">
                Nenhum serviço encontrado
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={renderLoadingFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Schedule Service Modal */}
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
