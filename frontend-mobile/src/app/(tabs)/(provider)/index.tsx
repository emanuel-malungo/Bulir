import AddFundsModal from "@/components/modals/AddFundsModal";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useLoadBalance, useWallet } from "@/modules/wallet/useWallet";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface StatCard {
  id: number;
  icon: IconName;
  label: string;
  value: string;
  color: string;
}

export default function ProviderHome() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);

  // Buscar dados da carteira do provider
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const loadBalanceMutation = useLoadBalance();

  // Pegar saldo/ganhos
  const walletBalance = wallet?.balance ?? 0;

  // Handler para adicionar fundos
  const handleAddFunds = async (amount: number) => {
    try {
      await loadBalanceMutation.mutateAsync(amount);
    } catch (error) {
      throw error;
    }
  };

  // Dados estatísticos
  const monthlyEarnings = 1250.75;
  const completedServices = 48;
  const averageRating = 4.9;

  const stats: StatCard[] = [
    {
      id: 2,
      icon: "calendar-outline" as IconName,
      label: "Este Mês",
      value: `Kz ${monthlyEarnings.toFixed(2)}`,
      color: "#3b82f6",
    },
    {
      id: 3,
      icon: "checkmark-circle-outline" as IconName,
      label: "Serviços Completos",
      value: completedServices.toString(),
      color: "#a855f7",
    },
    {
      id: 4,
      icon: "star-outline" as IconName,
      label: "Avaliação Média",
      value: averageRating.toString(),
      color: "#f59e0b",
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      clientName: "Maria Silva",
      serviceName: "Limpeza Residencial",
      scheduledAt: "2026-04-05T10:00:00Z",
      status: "CONFIRMED",
      price: 150.00,
    },
    {
      id: 2,
      clientName: "João Santos",
      serviceName: "Manutenção Elétrica",
      scheduledAt: "2026-04-06T14:30:00Z",
      status: "PENDING",
      price: 200.00,
    },
    {
      id: 3,
      clientName: "Ana Costa",
      serviceName: "Reparo Hidráulico",
      scheduledAt: "2026-04-07T09:00:00Z",
      status: "CONFIRMED",
      price: 175.00,
    },
  ];

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
        return "Confirmado";
      case "PENDING":
        return "Pendente";
      case "CANCELED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <LinearGradient
        colors={["#FFFFFF", "#F8F8F8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-8 pb-6"
      >
        <Text className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.fullName?.split(" ")[0]}! 👋
        </Text>
        <Text className="text-gray-500 mt-2">
          Confira seu desempenho de serviços
        </Text>
      </LinearGradient>

      <View className="px-6 py-6">
        {/* Saldo/Ganhos da Carteira */}
        <View className="mb-8">
          <LinearGradient
            colors={["#31ECC6", "#1aa89a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl px-6 py-6"
            style={{ borderRadius: 20 }}
          >
            <Text className="text-white text-sm opacity-90">Saldo Disponível</Text>
            {walletLoading ? (
              <View className="items-center justify-center py-4">
                <ActivityIndicator size="large" color="white" />
              </View>
            ) : (
              <>
                <Text className="text-4xl font-bold text-white mt-2">
                  Kz {walletBalance.toFixed(2)}
                </Text>
                <View className="flex-row justify-between mt-6 gap-3">
                  <TouchableOpacity 
                    onPress={() => setAddFundsModalVisible(true)}
                    className="flex-1 flex-row items-center justify-center gap-2 bg-white bg-opacity-20 rounded-lg py-3"
                  >
                    <Ionicons name="add-circle" size={20} color="white" />
                    <Text className="text-white font-semibold text-sm">Adicionar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => router.push("/(tabs)/(provider)/services")}
                    className="flex-1 flex-row items-center justify-center gap-2 bg-white bg-opacity-20 rounded-lg py-3"
                  >
                    <Ionicons name="briefcase" size={20} color="white" />
                    <Text className="text-white font-semibold text-sm">Meus Serviços</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </LinearGradient>
        </View>
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Próximos Agendamentos
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/(provider)/bookings")}
            >
              <Text className="text-[#31ECC6] font-semibold">Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {upcomingBookings.map((booking) => (
              <View
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 p-4"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base">
                      {booking.clientName}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {booking.serviceName}
                    </Text>
                  </View>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: getStatusColor(booking.status) + "20" }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: getStatusColor(booking.status) }}
                    >
                      {getStatusLabel(booking.status)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm">
                      {formatDate(booking.scheduledAt)}
                    </Text>
                  </View>
                  <Text className="text-gray-900 font-bold">
                    R$ {typeof booking.price === 'number' ? booking.price.toFixed(2) : '0.00'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="gap-3 mb-4">
          <TouchableOpacity
            className="bg-gradient-to-r rounded-2xl p-4 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: "#31ECC6",
            }}
            onPress={() => router.push("/(tabs)/(provider)/services")}
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text className="text-white font-bold text-base">
              Adicionar Novo Serviço
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Funds Modal */}
      <AddFundsModal
        visible={addFundsModalVisible}
        onClose={() => setAddFundsModalVisible(false)}
        onConfirm={handleAddFunds}
        isLoading={loadBalanceMutation.isPending}
      />
    </ScrollView>
  );
}
