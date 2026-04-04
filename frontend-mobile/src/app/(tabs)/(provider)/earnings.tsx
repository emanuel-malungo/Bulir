import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface EarningCard {
  id: number;
  label: string;
  amount: number;
  period: string;
  icon: IconName;
  color: string;
}

interface Transaction {
  id: number;
  serviceName: string;
  clientName: string;
  amount: number;
  date: string;
  type: "completed" | "pending" | "refunded";
}

export default function ProviderEarningsScreen() {
  const totalEarnings = 3850.5;
  const monthlyEarnings = 1250.75;
  const weekEarnings = 425.0;
  const pendingEarnings = 250.0;

  const earningCards: EarningCard[] = [
    {
      id: 1,
      label: "Ganhos Totais",
      amount: totalEarnings,
      period: "Total",
      icon: "cash-outline",
      color: "#10b981",
    },
    {
      id: 2,
      label: "Este Mês",
      amount: monthlyEarnings,
      period: "Abril 2026",
      icon: "calendar-outline",
      color: "#3b82f6",
    },
    {
      id: 3,
      label: "Esta Semana",
      amount: weekEarnings,
      period: "Semana atual",
      icon: "trending-up-outline",
      color: "#a855f7",
    },
    {
      id: 4,
      label: "Pendente",
      amount: pendingEarnings,
      period: "Aguardando",
      icon: "time-outline",
      color: "#f59e0b",
    },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: 1,
      serviceName: "Limpeza Residencial",
      clientName: "Maria Silva",
      amount: 150.0,
      date: "2026-04-02",
      type: "completed",
    },
    {
      id: 2,
      serviceName: "Manutenção Elétrica",
      clientName: "João Santos",
      amount: 200.0,
      date: "2026-04-01",
      type: "pending",
    },
    {
      id: 3,
      serviceName: "Reparo Hidráulico",
      clientName: "Ana Costa",
      amount: 175.0,
      date: "2026-03-30",
      type: "completed",
    },
    {
      id: 4,
      serviceName: "Pintura Residencial",
      clientName: "Carlos Oliveira",
      amount: 120.0,
      date: "2026-03-28",
      type: "completed",
    },
    {
      id: 5,
      serviceName: "Limpeza Comercial",
      clientName: "Pedro Lucas",
      amount: 250.0,
      date: "2026-03-25",
      type: "refunded",
    },
  ];

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "completed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "refunded":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "completed":
        return "Recebido";
      case "pending":
        return "Pendente";
      case "refunded":
        return "Reembolsado";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
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
        <Text className="text-3xl font-bold text-white">Meus Ganhos</Text>
        <Text className="text-white text-opacity-80 mt-2">
          Acompanhe sua renda
        </Text>
      </LinearGradient>

      <View className="px-6 py-6">
        {/* Earnings Cards */}
        <View className="gap-3 mb-8">
          {earningCards.map((card) => (
            <LinearGradient
              key={card.id}
              colors={[card.color + "15", card.color + "05"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl border border-gray-100 p-4 flex-row items-center gap-4"
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center"
                style={{ backgroundColor: card.color + "20" }}
              >
                <Ionicons name={card.icon} size={24} color={card.color} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm font-medium">
                  {card.label}
                </Text>
                <View className="flex-row items-baseline gap-2 mt-1">
                  <Text className="text-gray-900 text-lg font-bold">
                    R$ {card.amount.toFixed(2)}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {card.period}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          className="rounded-2xl p-4 flex-row items-center justify-center gap-2 mb-8"
          style={{ backgroundColor: "#31ECC6" }}
        >
          <Ionicons name="download-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base">
            Sacar R$ {totalEarnings.toFixed(2)}
          </Text>
        </TouchableOpacity>

        {/* Transactions */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Transações Recentes
          </Text>

          <View className="gap-3">
            {recentTransactions.map((transaction) => (
              <View
                key={transaction.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-base">
                    {transaction.serviceName}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-2">
                    <Text className="text-gray-500 text-xs">
                      {transaction.clientName}
                    </Text>
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          getTransactionColor(transaction.type) + "20",
                      }}
                    >
                      <Text
                        className="text-xs font-bold"
                        style={{
                          color: getTransactionColor(transaction.type),
                        }}
                      >
                        {getTransactionLabel(transaction.type)}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-xs mt-1">
                    {formatDate(transaction.date)}
                  </Text>
                </View>
                <Text className="text-gray-900 font-bold text-base">
                  +R$ {transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
