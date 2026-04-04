import { useReservations } from "@/modules/reservation/useReservation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const ITEMS_PER_PAGE = 20;

export default function ReservationsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useReservations({ limit: ITEMS_PER_PAGE });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "#31ECC6";
      case "PENDING":
        return "#f59e0b";
      case "CANCELED":
        return "#ef4444";
      default:
        return "#9ca3af";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmada";
      case "PENDING":
        return "Pendente";
      case "CANCELED":
        return "Cancelada";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace('.', '');
    const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return { day, month, time };
  };

  const displayReservations = data?.data || [];

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
          {error instanceof Error ? error.message : "Não conseguimos carregar suas reservas agora."}
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mt-10 w-full py-5 bg-[#0C2340] rounded-[24px] items-center"
        >
          <Text className="text-white font-black uppercase text-xs tracking-widest">Voltar para Início</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent />

      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between bg-white border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center bg-gray-50"
        >
          <Ionicons name="chevron-back" size={24} color="#0C2340" />
        </TouchableOpacity>
        <Text className="text-[#0C2340] text-xl font-black italic tracking-tighter uppercase">
          Minhas Reservas
        </Text>
        <View className="w-10" /> {/* Spacer */}
      </View>

      {isLoading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#31ECC6" />
          <Text className="text-gray-400 text-[10px] font-black uppercase mt-4 tracking-widest">
            Buscando sua agenda...
          </Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#31ECC6"]} />
          }
        >
          <View className="px-6 py-8">
            {displayReservations.length > 0 ? (
              <View className="gap-4">
                {displayReservations.map((reservation) => {
                  const { day, month, time } = formatDate(reservation.scheduledAt);
                  return (
                    <TouchableOpacity
                      key={reservation.id}
                      className="bg-white border-2 border-gray-50 rounded-[32px] p-6 flex-row items-center gap-4 shadow-sm shadow-black/5"
                    >
                      <View className="w-14 h-14 bg-[#0C2340] rounded-[20px] items-center justify-center border border-[#0C2340]">
                        <Text className="text-[#31ECC6] font-black text-xl">
                          {day}
                        </Text>
                        <Text className="text-white text-[9px] font-black uppercase">
                          {month}
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text className="text-[#0C2340] font-black text-base" numberOfLines={1}>
                          {reservation.serviceName}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-1">
                          <Ionicons name="time-outline" size={12} color="#9ca3af" />
                          <Text className="text-gray-400 text-xs font-bold">
                            {time} • {reservation.provider?.fullName || `Provedor #${reservation.providerId}`}
                          </Text>
                        </View>
                      </View>

                      <View className="items-end">
                        <Text className="text-[#0C2340] font-black text-sm">
                          Kz {Number(reservation.servicePrice).toLocaleString("pt-AO")}
                        </Text>
                        <View
                          className="mt-2 px-3 py-1 rounded-full border"
                          style={{
                            borderColor: getStatusColor(reservation.status) + "40",
                            backgroundColor: getStatusColor(reservation.status) + "10",
                          }}
                        >
                          <Text
                            className="text-[9px] font-black uppercase"
                            style={{ color: getStatusColor(reservation.status) }}
                          >
                            {getStatusLabel(reservation.status)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View className="border-2 border-dashed border-gray-100 rounded-[32px] py-16 items-center bg-gray-50/30">
                <View className="w-20 h-20 bg-gray-100 rounded-[30px] items-center justify-center mb-6">
                  <Ionicons name="calendar-outline" size={40} color="#d1d5db" />
                </View>
                <Text className="text-[#0C2340] text-xl font-black uppercase italic tracking-tighter">
                  Nenhuma reserva
                </Text>
                <Text className="text-gray-400 text-xs mt-2 font-bold tracking-widest uppercase">
                  Sua agenda está livre por enquanto
                </Text>
                <TouchableOpacity 
                  onPress={() => router.push("/(tabs)/(client)")}
                  className="mt-8 px-8 py-4 bg-[#31ECC6] rounded-[24px] shadow-lg shadow-[#31ECC6]/30"
                >
                  <Text className="text-[#0C2340] font-black uppercase text-[10px] tracking-widest">
                    Agendar Serviço
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
