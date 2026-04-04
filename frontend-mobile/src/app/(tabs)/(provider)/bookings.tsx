import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface Booking {
  id: number;
  clientName: string;
  serviceName: string;
  scheduledAt: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELED";
  price: number;
  clientRating?: number;
}

export default function ProviderBookingsScreen() {
  const [selectedTab, setSelectedTab] = useState("active");

  const activeBookings: Booking[] = [
    {
      id: 1,
      clientName: "Maria Silva",
      serviceName: "Limpeza Residencial",
      scheduledAt: "2026-04-05T10:00:00Z",
      status: "CONFIRMED",
      price: 150.0,
    },
    {
      id: 2,
      clientName: "João Santos",
      serviceName: "Manutenção Elétrica",
      scheduledAt: "2026-04-06T14:30:00Z",
      status: "PENDING",
      price: 200.0,
    },
  ];

  const completedBookings: Booking[] = [
    {
      id: 3,
      clientName: "Ana Costa",
      serviceName: "Reparo Hidráulico",
      scheduledAt: "2026-03-28T09:00:00Z",
      status: "COMPLETED",
      price: 175.0,
      clientRating: 5,
    },
    {
      id: 4,
      clientName: "Carlos Oliveira",
      serviceName: "Pintura Residencial",
      scheduledAt: "2026-03-20T08:00:00Z",
      status: "COMPLETED",
      price: 120.0,
      clientRating: 4.5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "#10b981";
      case "PENDING":
        return "#f59e0b";
      case "COMPLETED":
        return "#3b82f6";
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
      case "COMPLETED":
        return "Concluído";
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
        colors={["#31ECC6", "#1aa89a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-8 pb-6"
      >
        <Text className="text-3xl font-bold text-white">Agendamentos</Text>
        <Text className="text-white text-opacity-80 mt-2">
          Gerencie seus compromissos
        </Text>
      </LinearGradient>

      <View className="px-6 py-6">
        {/* Tab selector */}
        <View className="flex-row gap-2 mb-6">
          <TouchableOpacity
            onPress={() => setSelectedTab("active")}
            className={`flex-1 py-3 px-4 rounded-xl border-2 ${
              selectedTab === "active"
                ? "bg-[#31ECC6] border-[#31ECC6]"
                : "bg-white border-gray-200"
            }`}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons
                name="calendar-outline"
                size={18}
                color={selectedTab === "active" ? "white" : "#31ECC6"}
              />
              <Text
                className={`font-bold text-center ${
                  selectedTab === "active" ? "text-white" : "text-gray-700"
                }`}
              >
                Ativos
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab("completed")}
            className={`flex-1 py-3 px-4 rounded-xl border-2 ${
              selectedTab === "completed"
                ? "bg-[#31ECC6] border-[#31ECC6]"
                : "bg-white border-gray-200"
            }`}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={selectedTab === "completed" ? "white" : "#31ECC6"}
              />
              <Text
                className={`font-bold text-center ${
                  selectedTab === "completed" ? "text-white" : "text-gray-700"
                }`}
              >
                Histórico
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bookings List */}
        <View className="gap-4">
          {(selectedTab === "active" ? activeBookings : completedBookings).map(
            (booking) => (
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

                {booking.clientRating && (
                  <View className="flex-row items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                    <Ionicons name="star" size={16} color="#f59e0b" />
                    <Text className="text-gray-600 text-sm">
                      Avaliação: {booking.clientRating} ⭐
                    </Text>
                  </View>
                )}

                {selectedTab === "active" && (
                  <View className="flex-row gap-2 mt-3">
                    <TouchableOpacity className="flex-1 bg-[#31ECC6] rounded-lg py-2 items-center justify-center">
                      <Text className="text-white font-bold text-sm">
                        Confirmar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-gray-100 rounded-lg py-2 items-center justify-center">
                      <Text className="text-gray-600 font-bold text-sm">
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
}
