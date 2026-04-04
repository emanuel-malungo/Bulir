import AddFundsModal from "@/components/modals/AddFundsModal";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useReservations } from "@/modules/reservation/useReservation";
import { useLoadBalance, useWallet } from "@/modules/wallet/useWallet";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function ClientHome() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);

  // Buscar dados da API
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: reservationsData, isLoading: reservationsLoading } = useReservations();
  const loadBalanceMutation = useLoadBalance();

  // Pegar saldo da carteira
  const walletBalance = wallet?.balance ?? 0;

  // Handler para adicionar fundos
  const handleAddFunds = async (amount: number) => {
    try {
      await loadBalanceMutation.mutateAsync(amount);
    } catch (error) {
      throw error;
    }
  };

  // Pegar todas as reservas e filtrar por search
  const allReservations = reservationsData?.data ?? [];
  const filteredReservations = allReservations.filter((reservation) =>
    reservation.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pegar primeiras 2 reservas filtradas
  const recentReservations = filteredReservations.slice(0, 2);


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

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#31ECC6" translucent />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-600 text-sm">Bem-vindo,</Text>
              <Text className="text-2xl font-bold text-gray-900 mt-1">
                {user?.fullName?.split(" ")[0]}
              </Text>
            </View>
            <TouchableOpacity 
              className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center"
              onPress={() => router.push("/(tabs)/(client)/profile")}
            >
              <Ionicons name="person-circle" size={40} color="#31ECC6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Busca e Filtros */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3 items-center">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 h-12 gap-2">
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Buscar serviços..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-gray-900 text-sm"
              />
            </View>
            <TouchableOpacity className="rounded-full w-12 h-12 items-center justify-center" style={{
              backgroundColor: "#f3f4f6",
            }}>
              <Ionicons name="options" size={20} color="#31ECC6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Saldo da Carteira */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={["#31ECC6", "#1aa89a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl px-6 py-6"
            style={{ borderRadius: 20 }}
          >
            <Text className="text-white text-sm opacity-90">Saldo da Carteira</Text>
            {walletLoading ? (
              <View className="items-center justify-center py-4">
                <ActivityIndicator size="large" color="white" />
              </View>
            ) : (
              <>
                <Text className="text-4xl font-bold text-white mt-2">
                  Kz {walletBalance.toFixed(2)}
                </Text>
                <View className="flex-row justify-between mt-6">
                  <TouchableOpacity 
                    onPress={() => setAddFundsModalVisible(true)}
                    className="flex-row items-center gap-2"
                  >
                    <Ionicons name="add-circle" size={24} color="white" />
                    <Text className="text-white font-semibold">Adicionar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </LinearGradient>
        </View>

        {/* Histórico de Reservas */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Histórico</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/(client)/reservations")}>
              <Text className="text-[#31ECC6] font-semibold">Ver tudo</Text>
            </TouchableOpacity>
          </View>

          {reservationsLoading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#31ECC6" />
            </View>
          ) : recentReservations.length === 0 ? (
            <View className="bg-gray-50 rounded-xl p-6 items-center justify-center">
              <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-sm mt-3 text-center">
                Nenhuma reserva realizada ainda
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-3 justify-between">
              {recentReservations.map((reservation) => (
                <TouchableOpacity
                  key={reservation.id}
                  className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                  style={{ width: "48%" }}
                >
                  <View className="gap-2">
                    {/* Status Badge */}
                    <View
                      style={{
                        backgroundColor: getStatusColor(reservation.status) + "20",
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        alignSelf: "flex-start",
                      }}
                    >
                      <Text
                        style={{ color: getStatusColor(reservation.status) }}
                        className="text-xs font-semibold"
                      >
                        {getStatusLabel(reservation.status)}
                      </Text>
                    </View>

                    {/* Service Name */}
                    <Text className="font-semibold text-gray-900 text-sm leading-tight">
                      {reservation.serviceName}
                    </Text>

                    {/* Provider */}
                    <Text className="text-gray-500 text-xs">
                      {reservation.provider?.fullName || "Provedor desconhecido"}
                    </Text>

                    {/* Date */}
                    <Text className="text-gray-400 text-xs">
                      {formatDate(reservation.scheduledAt)}
                    </Text>

                    {/* Price */}
                    <View className="border-t border-gray-200 pt-2 mt-1">
                      <Text className="font-bold text-gray-900 text-sm">
                        Kz {Number(reservation.servicePrice).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Add Funds Modal */}
      <AddFundsModal
        visible={addFundsModalVisible}
        onClose={() => setAddFundsModalVisible(false)}
        onConfirm={handleAddFunds}
        isLoading={loadBalanceMutation.isPending}
      />
    </View>
  );
}