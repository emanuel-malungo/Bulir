import { useAuthStore } from "@/modules/auth/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface MenuItem {
  id: number;
  icon: IconName;
  label: string;
  action: () => void;
}

export default function ProviderProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Dados de perfil do provider
  const profileData = {
    fullName: user?.fullName || "Provedor",
    email: user?.email || "provedor@example.com",
    phoneNumber: "(11) 98765-4321",
    nif: "123.456.789-00",
    role: "PROVIDER",
    joinedDate: "2023-06-15",
    completedServices: 48,
    rating: 4.9,
    reviews: 156,
    verified: true,
    responseTime: "< 2 horas",
  };

  const menuItems: MenuItem[] = [
    {
      id: 1,
      icon: "person-outline" as IconName,
      label: "Editar Perfil",
      action: () => {},
    },
    {
      id: 2,
      icon: "location-outline" as IconName,
      label: "Área de Atendimento",
      action: () => {},
    },
    {
      id: 3,
      icon: "card-outline" as IconName,
      label: "Dados Bancários",
      action: () => {},
    },
    {
      id: 4,
      icon: "notifications-outline" as IconName,
      label: "Notificações",
      action: () => {},
    },
    {
      id: 5,
      icon: "shield-checkmark-outline" as IconName,
      label: "Segurança",
      action: () => {},
    },
    {
      id: 6,
      icon: "document-text" as IconName,
      label: "Certificados",
      action: () => {},
    },
    {
      id: 7,
      icon: "help-circle-outline" as IconName,
      label: "Ajuda & Suporte",
      action: () => {},
    },
    {
      id: 8,
      icon: "eye-off" as IconName,
      label: "Privacidade",
      action: () => {},
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
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
        <View className="items-center mb-4">
          {/* Avatar */}
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Text className="text-4xl font-bold text-white">
              {profileData.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </View>

          {/* Name and Email */}
          <View className="items-center mb-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-bold text-white">
                {profileData.fullName}
              </Text>
              {profileData.verified && (
                <Ionicons name="checkmark-circle" size={20} color="white" />
              )}
            </View>
            <Text className="text-white text-opacity-80 mt-1">
              {profileData.email}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View className="px-6 py-6">
        {/* Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 items-center">
            <Text className="text-2xl font-bold text-gray-900">
              {profileData.completedServices}
            </Text>
            <Text className="text-gray-600 text-xs font-medium mt-1">
              Serviços
            </Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 items-center">
            <View className="flex-row items-center gap-1">
              <Text className="text-2xl font-bold text-gray-900">
                {profileData.rating}
              </Text>
              <Ionicons name="star" size={16} color="#f59e0b" />
            </View>
            <Text className="text-gray-600 text-xs font-medium mt-1">
              Avaliação
            </Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 items-center">
            <Text className="text-2xl font-bold text-gray-900">
              {profileData.reviews}
            </Text>
            <Text className="text-gray-600 text-xs font-medium mt-1">
              Avaliações
            </Text>
          </View>
        </View>

        {/* Provider Info */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="time-outline" size={16} color="#31ECC6" />
              <Text className="text-gray-600 font-medium">Tempo de Resposta</Text>
            </View>
            <Text className="text-gray-900 font-bold">
              {profileData.responseTime}
            </Text>
          </View>
          <View className="border-t border-gray-100 pt-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={16} color="#31ECC6" />
              <Text className="text-gray-600 font-medium">Membro Desde</Text>
            </View>
            <Text className="text-gray-900 font-bold">
              {new Date(profileData.joinedDate).toLocaleDateString("pt-BR")}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <Text className="text-lg font-bold text-gray-900 mb-4">Configurações</Text>
        <View className="gap-3 mb-6">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.action}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Ionicons name={item.icon} size={20} color="#31ECC6" />
                <Text className="text-gray-900 font-medium">{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-2xl p-4 items-center justify-center border-2 border-red-200 mb-4"
          style={{ backgroundColor: "#fee2e2" }}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text className="text-red-600 font-bold text-base">Sair</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
