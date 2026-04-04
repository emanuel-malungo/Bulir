import AddFundsModal from "@/components/modals/AddFundsModal";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useReservations } from "@/modules/reservation/useReservation";
import { useLoadBalance, useWallet } from "@/modules/wallet/useWallet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClientHome() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Buscar dados da API
  const { data: wallet, isLoading: walletLoading, refetch: refetchWallet } = useWallet();
  const { data: reservationsData, isLoading: reservationsLoading, refetch: refetchReservations } = useReservations();
  const loadBalanceMutation = useLoadBalance();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWallet(), refetchReservations()]);
    setRefreshing(false);
  };

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

  // Pegar primeiras 4 reservas para o grid (2x2)
  const recentReservations = filteredReservations.slice(0, 4);

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

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent />

      {/* Header Fino e Elegante */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[3px]">
            Bulir Client
          </Text>
          <Text className="text-[#0C2340] text-2xl font-black italic tracking-tighter">
            Olá, {user?.fullName?.split(" ")[0] || "Explorador"}
          </Text>
        </View>

        <TouchableOpacity
          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 items-center justify-center shadow-sm"
          onPress={() => router.push("/(tabs)/(client)/profile")}
        >
          <Ionicons name="apps" size={24} color="#0C2340" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#31ECC6"]} />
        }
      >
        {/* Busca Minimalista */}
        <View className="my-6">
          <View className="flex-row items-center bg-white border border-gray-100 rounded-3xl px-6 h-16 shadow-sm shadow-black/5 gap-3">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              placeholder="O que você precisa hoje?"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-[#0C2340] font-medium text-sm"
              onSubmitEditing={() => router.push("/(tabs)/(client)/services")}
            />
          </View>
        </View>

        {/* Categorias - Navegação para aba de Serviços */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-5 px-1">
            <Text className="text-[#0C2340] text-lg font-black uppercase italic tracking-tighter">
               Categorias
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/(client)/services")}>
              <Text className="text-[#31ECC6] text-[10px] font-black uppercase tracking-widest">
                Explorar mais
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
             {[
               { icon: "brush-outline", label: "Limpeza" },
               { icon: "build-outline", label: "Reparos" },
               { icon: "cut-outline", label: "Beleza" },
               { icon: "school-outline", label: "Educação" },
               { icon: "paw-outline", label: "Pets" }
             ].map((cat, i) => (
               <TouchableOpacity 
                 key={i}
                 onPress={() => router.push("/(tabs)/(client)/services")}
                 className="bg-white mx-2 px-6 py-5 rounded-[32px] border border-gray-50 shadow-sm items-center justify-center w-24"
               >
                 <View className="w-10 h-10 bg-gray-50 rounded-2xl items-center justify-center mb-2">
                    <Ionicons name={cat.icon as any} size={20} color="#31ECC6" />
                 </View>
                 <Text className="text-[#0C2340] font-black text-[9px] uppercase tracking-tighter">{cat.label}</Text>
               </TouchableOpacity>
             ))}
          </ScrollView>
        </View>

        {/* Saldo Destaque (Diferente do Provider) */}
        <View className="mb-10 relative">
          <View className="bg-[#0C2340] rounded-[40px] p-8 shadow-2xl shadow-[#0C2340]/40 overflow-hidden">
            {/* Detalhe Decorativo */}
            <View className="absolute -right-10 -top-10 w-40 h-40 bg-[#31ECC6]/10 rounded-full" />
            
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mb-1">
                  Crédito Disponível
                </Text>
                <View className="flex-row items-baseline gap-2 flex-1">
                  <Text 
                    className="text-[#31ECC6] text-4xl font-black italic tracking-tighter"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                  >
                    {showBalance ? (
                      `Kz ${walletBalance.toLocaleString("pt-AO", { minimumFractionDigits: 1 })}`
                    ) : (
                      "••••••"
                    )}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                onPress={() => setShowBalance(!showBalance)}
                className="w-10 h-10 items-center justify-center rounded-xl bg-white/5"
              >
                <Ionicons
                  name={showBalance ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="px-4 py-2 bg-[#31ECC6]/20 rounded-full border border-[#31ECC6]/30">
                <Text className="text-[#31ECC6] text-[8px] font-black uppercase tracking-widest">
                  Carteira Digital
                </Text>
              </View>
            </View>
          </View>

          {/* Botão de Adicionar Fundos Criativo (Floating out of the card) */}
          <TouchableOpacity
            onPress={() => setAddFundsModalVisible(true)}
            activeOpacity={0.9}
            className="absolute -bottom-6 right-8 w-16 h-16 bg-[#31ECC6] rounded-[22px] items-center justify-center shadow-xl shadow-[#31ECC6]/40 border-4 border-[#F8FAFC]"
          >
             <Ionicons name="add" size={32} color="#0C2340" />
          </TouchableOpacity>
        </View>

        {/* Título de Seção */}
        <View className="flex-row justify-between items-end mb-6 px-1">
          <View>
            <Text className="text-[#0C2340] text-xl font-black uppercase italic tracking-tighter">
              Atividades
            </Text>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Seus últimos serviços
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/(client)/reservations")}>
            <View className="bg-white px-4 py-2 rounded-full border border-gray-100">
              <Text className="text-[#0C2340] font-black uppercase text-[8px] tracking-widest">Ver tudo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Grid de Atividades (2 Colunas) */}
        {reservationsLoading ? (
          <ActivityIndicator color="#31ECC6" size="large" />
        ) : recentReservations.length === 0 ? (
          <View className="bg-white border border-gray-100 rounded-[32px] py-12 items-center">
            <Ionicons name="calendar-outline" size={40} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 font-bold uppercase text-[9px] tracking-widest">
              Sem reservas recentes
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {recentReservations.map((reservation) => {
              const { day, month } = formatDate(reservation.scheduledAt);
              const statusColor = getStatusColor(reservation.status);
              
              return (
                <TouchableOpacity
                  key={reservation.id}
                  activeOpacity={0.7}
                  className="bg-white rounded-[32px] p-5 shadow-sm shadow-black/5 border border-gray-50"
                  style={{ width: "48%" }}
                  onPress={() => router.push("/(tabs)/(client)/reservations")}
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="w-10 h-10 bg-gray-50 rounded-2xl items-center justify-center">
                       <Text className="text-[#0C2340] font-black text-sm">{day}</Text>
                       <Text className="text-[#0C2340]/40 font-black text-[7px] uppercase">{month}</Text>
                    </View>
                    <View 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: statusColor }}
                    />
                  </View>

                  <Text className="text-[#0C2340] font-black text-xs mb-1" numberOfLines={2}>
                    {reservation.serviceName}
                  </Text>
                  
                  <Text className="text-gray-400 text-[9px] font-bold uppercase mb-3" numberOfLines={1}>
                    {reservation.provider?.fullName?.split(" ")[0] || "Provedor"}
                  </Text>

                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-50">
                    <Text className="text-[#0C2340] font-black text-[10px]">
                      Kz {Number(reservation.servicePrice).toLocaleString("pt-AO")}
                    </Text>
                    <Ionicons name="chevron-forward" size={12} color="#D1D5DB" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

      </ScrollView>

      {/* Add Funds Modal */}
      <AddFundsModal
        visible={addFundsModalVisible}
        onClose={() => setAddFundsModalVisible(false)}
        onConfirm={handleAddFunds}
        isLoading={loadBalanceMutation.isPending}
      />
    </SafeAreaView>
  );
}

