import { useCancelReservation, useConfirmReservation, useProviderReservations } from "@/modules/reservation/useReservation";
import { ReservationStatus } from "@/modules/reservation/reservation.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProviderReservationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<ReservationStatus | "ALL">("ALL");

  const {
    data: reservationsData,
    isLoading,
    refetch,
    isRefetching,
  } = useProviderReservations(
    activeFilter === "ALL" ? {} : { status: activeFilter }
  );

  const confirmMutation = useConfirmReservation();
  const cancelMutation = useCancelReservation();

  const reservations = reservationsData?.data ?? [];

  const handleConfirm = (id: number) => {
    Alert.alert(
      "Confirmar Reserva",
      "Deseja confirmar este agendamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Confirmar",
          onPress: async () => {
            try {
              await confirmMutation.mutateAsync(id);
              Alert.alert("Sucesso", "Reserva confirmada com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível confirmar a reserva.");
            }
          },
        },
      ]
    );
  };

  const handleCancel = (id: number) => {
    Alert.alert(
      "Cancelar Reserva",
      "Tem certeza que deseja cancelar este agendamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelMutation.mutateAsync(id);
              Alert.alert("Sucesso", "Reserva cancelada com sucesso.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível cancelar a reserva.");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "#31ECC6";
      case "PENDING": return "#f59e0b";
      case "CANCELED": return "#ef4444";
      default: return "#9ca3af";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View>
          <Text className="text-[#0C2340] text-lg font-bold">
            Agenda de Reservas
          </Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center bg-gray-50"
          onPress={() => {}}
        >
          <Ionicons name="filter-outline" size={20} color="#0C2340" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View className="px-6 py-4 bg-white">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveFilter("ALL")}
            className={`px-6 py-3 rounded-2xl mr-3 border-2 ${
              activeFilter === "ALL" ? "bg-[#0C2340] border-[#0C2340]" : "bg-white border-gray-50"
            }`}
          >
            <Text className={`font-black uppercase text-[10px] tracking-widest ${activeFilter === "ALL" ? "text-white" : "text-gray-400"}`}>
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter(ReservationStatus.PENDING)}
            className={`px-6 py-3 rounded-2xl mr-3 border-2 ${
              activeFilter === ReservationStatus.PENDING ? "bg-[#f59e0b] border-[#f59e0b]" : "bg-white border-gray-50"
            }`}
          >
            <Text className={`font-black uppercase text-[10px] tracking-widest ${activeFilter === ReservationStatus.PENDING ? "text-white" : "text-gray-400"}`}>
              Pendentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter(ReservationStatus.CONFIRMED)}
            className={`px-6 py-3 rounded-2xl mr-3 border-2 ${
              activeFilter === ReservationStatus.CONFIRMED ? "bg-[#31ECC6] border-[#31ECC6]" : "bg-white border-gray-50"
            }`}
          >
            <Text className={`font-black uppercase text-[10px] tracking-widest ${activeFilter === ReservationStatus.CONFIRMED ? "text-[#0C2340]" : "text-gray-400"}`}>
              Confirmadas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter(ReservationStatus.CANCELED)}
            className={`px-6 py-3 rounded-2xl mr-3 border-2 ${
              activeFilter === ReservationStatus.CANCELED ? "bg-[#ef4444] border-[#ef4444]" : "bg-white border-gray-50"
            }`}
          >
            <Text className={`font-black uppercase text-[10px] tracking-widest ${activeFilter === ReservationStatus.CANCELED ? "text-white" : "text-gray-400"}`}>
              Canceladas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-2"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#31ECC6"]} />
        }
      >
        {isLoading && !isRefetching ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator color="#31ECC6" size="large" />
          </View>
        ) : reservations.length === 0 ? (
          <View className="border border-dashed border-gray-200 rounded-[40px] py-20 items-center bg-gray-50/30 mt-4">
            <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center mb-6 border border-gray-100">
              <Ionicons name="calendar-outline" size={36} color="#d1d5db" />
            </View>
            <Text className="text-[#0C2340] font-black text-xl uppercase">Nenhuma reserva</Text>
            <Text className="text-gray-400 text-center px-12 mt-3 leading-5">
              Não encontramos nenhum agendamento com o status selecionado.
            </Text>
          </View>
        ) : (
          <View className="gap-6 pb-20">
            {reservations.map((reservation: any) => (
              <View
                key={reservation.id}
                className="bg-white border border-gray-100 rounded-[36px] p-6 shadow-sm shadow-gray-200"
              >
                {/* Header: Service Name & Status */}
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text className="text-[#0C2340] font-black text-xl" numberOfLines={1}>
                      {reservation.serviceName}
                    </Text>
                    <View
                      className="mt-2 self-start px-3 py-1 rounded-full border"
                      style={{
                        borderColor: getStatusColor(reservation.status) + "40",
                        backgroundColor: getStatusColor(reservation.status) + "10",
                      }}
                    >
                      <Text
                        className="text-[9px] font-black uppercase tracking-wider"
                        style={{ color: getStatusColor(reservation.status) }}
                      >
                        {reservation.status}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-[#0C2340] font-black text-lg">
                      Kz {Number(reservation.servicePrice).toLocaleString("pt-AO")}
                    </Text>
                  </View>
                </View>

                {/* Info: Date & Client */}
                <View className="bg-gray-50 rounded-2xl p-4 gap-3 mb-6">
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="time-outline" size={18} color="#0C2340" />
                    <Text className="text-[#0C2340] font-bold text-sm">
                      {formatDate(reservation.scheduledAt)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="person-outline" size={18} color="#0C2340" />
                    <Text className="text-gray-500 font-bold text-sm">
                      Cliente: {reservation.client?.fullName || "Não informado"}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                {reservation.status === "PENDING" && (
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className="flex-1 bg-[#31ECC6] py-4 rounded-[20px] items-center justify-center border border-[#31ECC6]"
                      onPress={() => handleConfirm(reservation.id)}
                      disabled={confirmMutation.isPending}
                    >
                      {confirmMutation.isPending ? (
                        <ActivityIndicator color="#0C2340" size="small" />
                      ) : (
                        <Text className="text-[#0C2340] font-black text-xs uppercase tracking-widest">
                          Aceitar
                        </Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-white border-2 border-red-500 py-4 rounded-[20px] items-center justify-center"
                      onPress={() => handleCancel(reservation.id)}
                      disabled={cancelMutation.isPending}
                    >
                      {cancelMutation.isPending ? (
                        <ActivityIndicator color="#ef4444" size="small" />
                      ) : (
                        <Text className="text-red-500 font-black text-xs uppercase tracking-widest">
                          Recusar
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {reservation.status === "CONFIRMED" && (
                   <TouchableOpacity
                    className="w-full bg-red-50 border border-red-100 py-4 rounded-[20px] items-center justify-center flex-row gap-2"
                    onPress={() => handleCancel(reservation.id)}
                  >
                    <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
                    <Text className="text-red-500 font-black text-xs uppercase tracking-widest">
                      Cancelar Agendamento
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
