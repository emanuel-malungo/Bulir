import { useReservations } from "@/modules/reservation/useReservation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 10;

export default function ReservationsScreen() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    error,
  } = useReservations({ limit: ITEMS_PER_PAGE });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "#10b981";
      case "PENDING":
        return "#f59e0b";
      case "CANCELED":
        return "#ef4444";
      default:
        return "#6b7280";
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
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const displayReservations = data?.data || [];

  // Error state
  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <StatusBar barStyle="dark-content" backgroundColor="#31ECC6" translucent />
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-gray-900 font-semibold mt-4">Erro ao carregar</Text>
        <Text className="text-gray-500 text-sm mt-1 text-center px-6">
          {error instanceof Error ? error.message : "Erro desconhecido"}
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mt-6 px-6 py-3 bg-[#31ECC6] rounded-lg"
        >
          <Text className="text-white font-bold">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#31ECC6" translucent />

      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center gap-3 mb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-900">Minhas Reservas</Text>
        </View>
        <Text className="text-gray-500 text-sm ml-10">
          Lista de todas as suas reservas agendadas.
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#31ECC6" />
          <Text className="text-gray-500 text-sm mt-4">Carregando reservas...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Reservations List */}
          <View className="px-6 pb-8">
          {displayReservations.length > 0 ? (
            displayReservations.map((reservation) => (
              <TouchableOpacity
                key={reservation.id}
                className="bg-white rounded-2xl px-5 py-4 mb-3 border border-gray-200"
              >
                {/* Top Row - Service Name & Status */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                      {reservation.serviceName}
                    </Text>
                    <View className="flex-row items-center gap-1 mt-1">
                      <Ionicons name="person" size={12} color="#9CA3AF" />
                      <Text className="text-gray-600 text-xs">
                        Provedor #{reservation.providerId}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: getStatusColor(reservation.status) + "20",
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{ color: getStatusColor(reservation.status) }}
                      className="text-xs font-bold"
                    >
                      {getStatusLabel(reservation.status)}
                    </Text>
                  </View>
                </View>

                {/* Middle Row - Date & Price */}
                <View className="flex-row items-center justify-between py-3 border-t border-b border-gray-100 gap-3">
                  <View className="flex-row items-center gap-2 flex-1">
                    <Ionicons name="calendar" size={14} color="#31ECC6" />
                    <Text className="text-gray-700 font-semibold text-xs">
                      {formatDate(reservation.scheduledAt)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="pricetag" size={14} color="#31ECC6" />
                    <Text className="font-bold text-[#31ECC6] text-sm">
                      R$ {typeof reservation.servicePrice === 'number' ? reservation.servicePrice.toFixed(2) : parseFloat(String(reservation.servicePrice)).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                {reservation.status === "PENDING" && (
                  <TouchableOpacity className="mt-3 bg-red-50 py-2 rounded-lg items-center border border-red-200">
                    <Text className="text-red-600 font-bold text-xs">Cancelar Reserva</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 font-semibold mt-4 text-center">
                Nenhuma reserva
              </Text>
              <TouchableOpacity className="mt-6 bg-[#31ECC6] px-6 py-2 rounded-full">
                <Text className="text-white font-bold text-sm">Agendar Serviço</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
