import { useAuthStore } from "@/modules/auth/auth.store";
import { useCurrentUser } from "@/modules/user/useUser";
import { useWallet } from "@/modules/wallet/useWallet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProviderProfileScreen() {
  const { logout } = useAuthStore();
  const router = useRouter();

  // Fetching the most up-to-date user data from API
  const { data: userData, isLoading: userLoading } = useCurrentUser();
  const { data: walletData, isLoading: walletLoading } = useWallet();

  const profile = userData;
  const wallet = walletData;

  const roleName = profile?.userRoles?.[0]?.role?.name || profile?.role || "Provedor";

  const handleLogout = async () => {
    logout();
    router.replace("/(auth)");
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const infoItems = [
    { label: "E-mail", value: profile?.email, icon: "mail-outline" },
    { label: "NIF", value: profile?.nif, icon: "document-text-outline" },
    { label: "Membro desde", value: formatDate(profile?.createdAt), icon: "calendar-outline" },
    { label: "Última atualização", value: formatDate(profile?.updatedAt), icon: "sync-outline" },
  ];

  if (userLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#31ECC6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent />

      {/* Header (Consistent with Dashboard) */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View>
          <Text className="text-[#0C2340] text-lg font-bold">
            Perfil do Provedor
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-gray-50"
            onPress={() => {}}
          >
            <Ionicons name="settings-outline" size={20} color="#0C2340" />
          </TouchableOpacity>
          <View
            className="w-10 h-10 rounded-full border border-[#31ECC6] items-center justify-center bg-gray-50 overflow-hidden"
          >
            <Ionicons name="person" size={20} color="#31ECC6" />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        {/* Profile Identity Section */}
        <View className="items-center py-10">
          <View className="w-32 h-32 rounded-[48px] bg-[#0C2340] items-center justify-center border-4 border-[#31ECC6]/20">
            <Text className="text-white text-5xl font-black">
              {profile?.fullName?.charAt(0)}
            </Text>
            <View className="absolute -bottom-2 -right-2 bg-[#31ECC6] w-10 h-10 rounded-full items-center justify-center border-4 border-white">
               <Ionicons name="shield-checkmark" size={18} color="#0C2340" />
            </View>
          </View>
          
          <Text className="text-[#0C2340] text-3xl font-black mt-6 tracking-tighter text-center">
            {profile?.fullName}
          </Text>
          
          <View className="flex-row items-center gap-2 mt-3">
             <View className="bg-[#0C2340]/5 px-4 py-1.5 rounded-full border border-[#0C2340]/10">
                <Text className="text-[#0C2340] text-[10px] font-black uppercase tracking-widest text-center">
                  {roleName}
                </Text>
             </View>
             <View className={`px-4 py-1.5 rounded-full border ${profile?.isActive ? 'bg-[#31ECC6]/10 border-[#31ECC6]/30' : 'bg-red-50 border-red-100'}`}>
                <Text className={`text-[10px] font-black uppercase tracking-widest ${profile?.isActive ? 'text-[#31ECC6]' : 'text-red-600'}`}>
                  {profile?.isActive ? 'Ativo' : 'Inativo'}
                </Text>
             </View>
          </View>
        </View>

        {/* Balance Highlight Card */}
        <View className="bg-[#0C2340] rounded-[32px] p-8 mb-10 border border-[#0C2340]">
           <View className="flex-row justify-between items-center">
              <View>
                 <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Saldo Atual</Text>
                 <Text className="text-white text-3xl font-black">
                    Kz {Number(wallet?.balance || profile?.balance || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                 </Text>
              </View>
              <View className="w-14 h-14 bg-[#31ECC6] rounded-2xl items-center justify-center">
                 <Ionicons name="wallet" size={28} color="#0C2340" />
              </View>
           </View>
        </View>

        {/* Information Grid */}
        <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-[#0C2340] text-xl font-black uppercase tracking-widest italic">Informações</Text>
            <TouchableOpacity onPress={() => {}}>
               <Ionicons name="create-outline" size={20} color="#31ECC6" />
            </TouchableOpacity>
        </View>
        
        <View className="gap-4 mb-12">
          {infoItems.map((item, index) => (
            <View 
              key={index}
              className="bg-white border border-gray-100 rounded-[28px] p-5 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100">
                <Ionicons name={item.icon as any} size={20} color="#0C2340" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</Text>
                <Text className="text-[#0C2340] font-black text-base" numberOfLines={1}>{item.value || 'Não informado'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Logout Action */}
        <TouchableOpacity 
          className="flex-row items-center justify-center bg-red-50 border-2 border-red-100 py-6 rounded-[32px] gap-3 mb-12"
          onPress={handleLogout}
        >
           <Ionicons name="log-out-outline" size={24} color="#ef4444" />
           <Text className="text-red-600 font-extrabold text-base uppercase tracking-widest">Sair da Conta</Text>
        </TouchableOpacity>

        <Text className="text-gray-300 text-[10px] text-center font-bold uppercase tracking-widest mb-10">
          Versão do App 1.0.0
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
