import { useAuthStore } from "@/modules/auth/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface MenuItemProps {
  icon: IconName;
  label: string;
  value?: string;
  onPress: () => void;
  isLast?: boolean;
  destructive?: boolean;
}

const ProfileMenuItem = ({ icon, label, value, onPress, isLast, destructive }: MenuItemProps) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`flex-row items-center justify-between py-5 ${!isLast ? 'border-b border-gray-50' : ''}`}
  >
    <View className="flex-row items-center gap-4">
      <View className={`w-10 h-10 rounded-xl items-center justify-center ${destructive ? 'bg-red-50' : 'bg-[#0C2340]/5'}`}>
        <Ionicons name={icon} size={20} color={destructive ? "#ef4444" : "#0C2340"} />
      </View>
      <View>
        <Text className={`text-xs font-black uppercase tracking-widest ${destructive ? 'text-red-500' : 'text-[#0C2340]'}`}>
          {label}
        </Text>
        {value && (
          <Text className="text-gray-400 text-[10px] font-bold mt-0.5">{value}</Text>
        )}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={16} color={destructive ? "#fecaca" : "#D1D5DB"} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const profileData = user ? {
    fullName: user.fullName || "Usuário",
    email: user.email || "",
    nif: user.nif || "",
    balance: user.walletBalance ?? 0,
    role: user.role || "CLIENT",
    createdAt: user.createdAt || new Date(),
  } : null;

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Elegante */}
        <View className="px-6 py-8 items-center">
          <View className="relative">
            <View className="w-28 h-28 rounded-[40px] bg-white items-center justify-center shadow-xl shadow-black/10 border-4 border-white">
              <View className="w-full h-full rounded-[36px] bg-[#0C2340] items-center justify-center">
                <Text className="text-[#31ECC6] text-4xl font-black italic">
                  {profileData?.fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <View className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#31ECC6] rounded-2xl items-center justify-center border-4 border-[#F8FAFC]">
              <Ionicons name="camera" size={16} color="#0C2340" />
            </View>
          </View>

          <Text className="text-[#0C2340] text-2xl font-black uppercase italic tracking-tighter mt-6">
            {profileData?.fullName}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View className="px-3 py-1 bg-[#31ECC6]/10 rounded-full border border-[#31ECC6]/20">
              <Text className="text-[#31ECC6] text-[8px] font-black uppercase tracking-widest">
                Cliente Premium
              </Text>
            </View>
          </View>
        </View>

        {/* Dashboard de Informações Rápidas */}
        <View className="px-6 flex-row gap-4 mb-10">
          <View className="flex-1 bg-[#0C2340] rounded-[32px] p-5 shadow-lg shadow-[#0C2340]/20">
            <Ionicons name="wallet-outline" size={20} color="#31ECC6" />
            <Text className="text-white/40 text-[8px] font-black uppercase tracking-widest mt-4">Saldo Atual</Text>
            <Text className="text-white text-lg font-black italic tracking-tighter mt-1">
              Kz {profileData?.balance.toLocaleString("pt-AO")}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-[32px] p-5 border border-gray-100 shadow-sm">
            <Ionicons name="calendar-outline" size={20} color="#0C2340" />
            <Text className="text-gray-400 text-[8px] font-black uppercase tracking-widest mt-4">Desde de</Text>
            <Text className="text-[#0C2340] text-lg font-black italic tracking-tighter mt-1">
              {profileData?.createdAt ? formatDate(profileData.createdAt).split(' ')[1] : "--"} {profileData?.createdAt ? new Date(profileData.createdAt).getFullYear() : "--"}
            </Text>
          </View>
        </View>

        {/* Seções de Menu */}
        <View className="px-6 mb-10">
          <Text className="text-[#0C2340] text-xs font-black uppercase italic tracking-tighter mb-4 ml-1">
            Minha Conta
          </Text>
          <View className="bg-white rounded-[40px] px-6 py-2 shadow-sm border border-gray-50">
            <ProfileMenuItem 
              icon="person-outline" 
              label="Dados Pessoais" 
              value={profileData?.email}
              onPress={() => {}} 
            />
            <ProfileMenuItem 
              icon="card-outline" 
              label="Documento (NIF)" 
              value={profileData?.nif || "Não informado"}
              onPress={() => {}} 
            />
            <ProfileMenuItem 
              icon="shield-checkmark-outline" 
              label="Segurança e Senha" 
              onPress={() => {}} 
              isLast
            />
          </View>
        </View>

        <View className="px-6 mb-10">
          <Text className="text-[#0C2340] text-xs font-black uppercase italic tracking-tighter mb-4 ml-1">
            Preferências
          </Text>
          <View className="bg-white rounded-[40px] px-6 py-2 shadow-sm border border-gray-50">
            <ProfileMenuItem 
              icon="notifications-outline" 
              label="Notificações" 
              onPress={() => {}} 
            />
            <ProfileMenuItem 
              icon="language-outline" 
              label="Idioma" 
              value="Português (AO)"
              onPress={() => {}} 
            />
            <ProfileMenuItem 
              icon="help-circle-outline" 
              label="Central de Ajuda" 
              onPress={() => {}} 
              isLast
            />
          </View>
        </View>

        <View className="px-6 mb-12">
          <View className="bg-white rounded-[40px] px-6 py-2 shadow-sm border border-gray-50">
            <ProfileMenuItem 
              icon="log-out-outline" 
              label="Sair da Conta" 
              onPress={handleLogout} 
              isLast
              destructive
            />
          </View>
          
          <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[3px] text-center mt-10">
            Bulir • v1.0.0
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
