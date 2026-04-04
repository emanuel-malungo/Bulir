import { useAuthStore } from "@/modules/auth/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface MenuItem {
  id: number;
  icon: IconName;
  label: string;
  action: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Dados de perfil baseados em IUserDetail
  const profileData = user ? {
    id: user.id,
    fullName: user.fullName || "Usuário",
    email: user.email || "",
    nif: user.nif || "",
    balance: user.walletBalance ?? 0,
    isActive: user.isActive ?? true,
    roleId: user.roleId,
    role: user.role || "CLIENT",
    permissions: user.permissions || [],
    createdAt: user.createdAt || new Date(),
  } : null;

  // Função para formatar data
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const menuItems: MenuItem[] = [
    {
      id: 1,
      icon: "person-outline",
      label: "Editar Perfil",
      action: () => {},
    },
    {
      id: 2,
      icon: "shield-checkmark-outline",
      label: "Segurança",
      action: () => {},
    }
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
    
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-6">

          <Text className="text-3xl text-gray-900">Meu Perfil</Text>
          <Text className="text-gray-500 mt-2">
            Gerencie suas informações pessoais
          </Text>
        </View>

        {/* Profile Card - Simples e Limpo */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={["#31ECC6", "#1aa89a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl px-6 py-6 items-center"
          >
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-4">
              <Ionicons name="person-circle" size={56} color="#31ECC6" />
            </View>

            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-xl font-bold text-white">{profileData?.fullName || "Usuário"}</Text>
              {profileData?.isActive && (
                <Ionicons name="checkmark-circle" size={18} color="#fbbf24" />
              )}
            </View>

            <Text className="text-white text-opacity-80 text-xs">{profileData?.email}</Text>
          </LinearGradient>
        </View>
   
        {/* Account Info - Minimalista */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Dados Pessoais</Text>

          <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Email */}
            <TouchableOpacity className="px-5 py-3 border-b border-gray-100 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-xs mb-1">Email</Text>
                <Text className="text-gray-900 font-semibold text-sm">{profileData?.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </TouchableOpacity>

            {/* CPF/CNPJ */}
            <TouchableOpacity className="px-5 py-3 border-b border-gray-100 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-xs mb-1">CPF/CNPJ</Text>
                <Text className="text-gray-900 font-semibold text-sm">{profileData?.nif}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </TouchableOpacity>

            {/* Tipo de Conta */}
            <TouchableOpacity className="px-5 py-3 border-b border-gray-100 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-xs mb-1">Tipo de Conta</Text>
                <Text className="text-gray-900 font-semibold text-sm">{profileData?.role}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </TouchableOpacity>

            {/* Data de Inscrição */}
            <TouchableOpacity className="px-5 py-3 border-b border-gray-100 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-xs mb-1">Membro desde</Text>
                <Text className="text-gray-900 font-semibold text-sm">{profileData?.createdAt ? formatDate(profileData.createdAt) : "—"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </TouchableOpacity>

            {/* Saldo */}
            <TouchableOpacity className="px-5 py-3 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-xs mb-1">Saldo</Text>
                <Text className="text-gray-900 font-semibold text-sm">R$ {profileData?.balance?.toFixed(2) ?? "0.00"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 pb-12">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 rounded-2xl py-3 items-center border border-red-200"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="log-out" size={16} color="#dc2626" />
              <Text className="text-red-600 font-bold text-sm">Sair</Text>
            </View>
          </TouchableOpacity>

          <Text className="text-gray-400 text-xs text-center mt-4">
            Bulir • v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
