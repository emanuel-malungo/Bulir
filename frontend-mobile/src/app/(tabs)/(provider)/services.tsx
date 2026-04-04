import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  totalBookings: number;
  rating: number;
  icon: IconName;
}

export default function ProviderServicesScreen() {
  const router = useRouter();

  const myServices: Service[] = [
    {
      id: 1,
      name: "Limpeza Residencial",
      category: "Limpeza",
      price: 150.0,
      description: "Limpeza completa da casa",
      totalBookings: 24,
      rating: 4.8,
      icon: "home-outline",
    },
    {
      id: 2,
      name: "Manutenção Elétrica",
      category: "Elétrica",
      price: 200.0,
      description: "Reparo e manutenção de circuitos",
      totalBookings: 18,
      rating: 4.9,
      icon: "flash-outline",
    },
    {
      id: 3,
      name: "Reparo Hidráulico",
      category: "Hidráulica",
      price: 175.0,
      description: "Reparo de canos e torneiras",
      totalBookings: 15,
      rating: 4.7,
      icon: "water-outline",
    },
    {
      id: 4,
      name: "Pintura Residencial",
      category: "Pintura",
      price: 120.0,
      description: "Pintura de paredes e móveis",
      totalBookings: 12,
      rating: 4.6,
      icon: "brush-outline",
    },
  ];

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
        <Text className="text-3xl font-bold text-white">Meus Serviços</Text>
        <Text className="text-white text-opacity-80 mt-2">
          Gerencie seus serviços oferecidos
        </Text>
      </LinearGradient>

      <View className="px-6 py-6">
        {/* Add Service Button */}
        <TouchableOpacity
          className="rounded-2xl p-4 flex-row items-center justify-center gap-2 mb-6"
          style={{ backgroundColor: "#31ECC6" }}
        >
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base">Novo Serviço</Text>
        </TouchableOpacity>

        {/* Services List */}
        <View className="gap-4">
          {myServices.map((service) => (
            <View
              key={service.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 overflow-hidden"
            >
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: "#31ECC620" }}
                  >
                    <Ionicons
                      name={service.icon}
                      size={24}
                      color="#31ECC6"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base">
                      {service.name}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {service.category}
                    </Text>
                  </View>
                </View>
                <View className="bg-gray-100 rounded-lg px-2 py-1">
                  <Text className="text-gray-600 font-bold text-sm">
                    R$ {typeof service.price === 'number' ? service.price.toFixed(2) : '0.00'}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 text-sm mb-3">
                {service.description}
              </Text>

              <View className="flex-row gap-4 py-3 border-t border-gray-100">
                <View className="flex-row items-center gap-1 flex-1">
                  <Ionicons name="checkmark-circle" size={16} color="#31ECC6" />
                  <Text className="text-gray-600 text-xs">
                    {service.totalBookings} agendamentos
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 flex-1">
                  <Ionicons name="star" size={16} color="#f59e0b" />
                  <Text className="text-gray-600 text-xs">
                    {service.rating} avaliação
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity className="flex-1 bg-gray-100 rounded-lg py-2 items-center justify-center">
                  <Text className="text-gray-700 font-bold text-sm">Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-red-100 rounded-lg py-2 items-center justify-center">
                  <Text className="text-red-600 font-bold text-sm">Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
