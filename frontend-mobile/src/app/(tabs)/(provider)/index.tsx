import { useAuthStore } from "@/modules/auth/auth.store";
import { useReservations } from "@/modules/reservation/useReservation";
import { useWallet } from "@/modules/wallet/useWallet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProviderHome() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  // Data fetching
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: reservationsData, isLoading: reservationsLoading } = useReservations();

  const walletBalance = wallet?.balance ?? 0;
  const recentReservations = reservationsData?.data?.slice(0, 3) ?? [];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        {/* Right: Welcome Message */}
        <View className="items-end">
          <Text className="text-[#0C2340] text-lg font-bold">
            Olá, {user?.fullName?.split(" ")[0]}
          </Text>
        </View>
		
		{/* Left: Avatar and Settings */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-gray-50"
            onPress={() => {}}
          >
            <Ionicons name="settings-outline" size={20} color="#0C2340" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full border border-[#31ECC6] items-center justify-center bg-gray-50 overflow-hidden"
            onPress={() => router.push("/(tabs)/(provider)/profile")}
          >
            <Ionicons name="person" size={20} color="#31ECC6" />
          </TouchableOpacity>
        </View>

        
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-8">
        {/* Balance Card */}
        <View className="mb-10 rounded-[32px] p-8 bg-[#0C2340] border border-[#0C2340]">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-gray-400 text-xs font-semibold mb-2">
                SALDO TOTAL
              </Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-white text-3xl font-bold">
                  {showBalance
                    ? `Kz ${walletBalance.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}`
                    : "••••••"}
                </Text>
                <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                  <Ionicons
                    name={showBalance ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#31ECC6"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className="w-12 h-12 bg-[#31ECC6]/10 rounded-2xl items-center justify-center border border-[#31ECC6]/20">
              <Ionicons name="wallet-outline" size={24} color="#31ECC6" />
            </View>
          </View>

          {/* Create Service Action */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-[#31ECC6] py-5 rounded-3xl gap-2"
            onPress={() => {}}
          >
            <Ionicons name="add-circle" size={24} color="#0C2340" />
            <Text className="text-[#0C2340] font-black text-base uppercase">
              Criar Novo Serviço
            </Text>
          </TouchableOpacity>
        </View>

     

        {/* Recent Reservations */}
        <View className="mb-12">
          <View className="flex-row justify-between items-end mb-6">
            <View>
              <Text className="text-[#0C2340] text-xl font-bold">
                Reservas
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Acompanhe seus próximos serviços
              </Text>
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text className="text-[#31ECC6] font-bold">Ver tudo</Text>
            </TouchableOpacity>
          </View>

          {reservationsLoading ? (
            <ActivityIndicator color="#31ECC6" size="large" />
          ) : recentReservations.length === 0 ? (
            <View className="border border-dashed border-gray-200 rounded-[32px] py-12 items-center bg-gray-50/50">
              <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-400 mt-4 font-medium">Nenhuma reserva para exibir</Text>
            </View>
          ) : (
            <View className="gap-4">
              {recentReservations.map((reservation: any) => (
                <View
                  key={reservation.id}
                  className="bg-white border border-gray-100 rounded-[28px] p-5 flex-row items-center gap-4"
                >
                  <View className="w-14 h-14 bg-[#0C2340] rounded-2xl items-center justify-center">
                    <Text className="text-[#31ECC6] font-bold text-lg">
                      {formatDate(reservation.scheduledAt).split(" ")[0]}
                    </Text>
                    <Text className="text-white text-[9px] font-bold uppercase">
                      {formatDate(reservation.scheduledAt).split(" ")[1]}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-[#0C2340] font-bold text-base" numberOfLines={1}>
                      {reservation.serviceName}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-0.5">
                      {reservation.client?.fullName || "Cliente"}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-[#0C2340] font-bold text-sm">
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
                        className="text-[9px] font-bold uppercase"
                        style={{ color: getStatusColor(reservation.status) }}
                      >
                        {reservation.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
