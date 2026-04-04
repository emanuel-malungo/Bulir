import { useAuthStore } from "@/modules/auth/auth.store";
import { useProviderStats, useProviderReservations } from "@/modules/reservation/useReservation";
import { useCurrentUser } from "@/modules/user/useUser";
import { useWallet } from "@/modules/wallet/useWallet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProviderHome() {
	const router = useRouter();
	const [showBalance, setShowBalance] = useState(true);

	// Data fetching from API
	const { data: userData, isLoading: userLoading, refetch: refetchUser } = useCurrentUser();
	const { data: walletData, isLoading: walletLoading, refetch: refetchWallet } = useWallet();
	const { data: reservationsData, isLoading: reservationsLoading, refetch: refetchReservations } = useProviderReservations();
	const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useProviderStats();

	const profile = userData;
	const wallet = walletData;
	const stats = statsData;
	const recentReservations = reservationsData?.data?.slice(0, 3) ?? [];

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await Promise.all([
			refetchUser(),
			refetchWallet(),
			refetchReservations(),
			refetchStats()
		]);
		setRefreshing(false);
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
			month: "short",
		});
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<StatusBar barStyle="dark-content" backgroundColor="white" translucent />

			{/* Header */}
			<View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
				<View className="items-end">
					<Text className="text-[#0C2340] text-lg font-bold">
						Olá, {profile?.fullName?.split(" ")[0] || "Provedor"}
					</Text>
				</View>

				<View className="flex-row items-center gap-3">
					<TouchableOpacity
						className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-gray-50"
						onPress={() => { }}
					>
						<Ionicons name="notifications-outline" size={20} color="#0C2340" />
					</TouchableOpacity>
					<TouchableOpacity
						className="w-10 h-10 rounded-full border border-[#31ECC6] items-center justify-center bg-gray-50 overflow-hidden"
						onPress={() => router.push("/(tabs)/(provider)/profile")}
					>
						<Ionicons name="person" size={20} color="#31ECC6" />
					</TouchableOpacity>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				className="flex-1 px-6 pt-8"
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#31ECC6"]} />
				}
			>
				{/* Balance Card */}
				<View className="mb-10 rounded-[40px] p-8 bg-[#31ECC6] shadow-xl shadow-[#31ECC6]/20">
					<View className="flex-row justify-between items-start mb-8">
						<View>
							<Text className="text-[#0C2340]/60 text-[10px] font-black uppercase mb-2 tracking-[2px]">
								Saldo Total
							</Text>
							<View className="flex-row items-center gap-3">
								<Text className="text-[#0C2340] text-4xl font-black italic tracking-tighter">
									{showBalance
										? `Kz ${Number(wallet?.balance || profile?.balance || 0).toLocaleString("pt-AO", {
											minimumFractionDigits: 2,
										})}`
										: "••••••••"}
								</Text>
								<TouchableOpacity 
                  onPress={() => setShowBalance(!showBalance)}
                  className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                >
									<Ionicons
										name={showBalance ? "eye-off-outline" : "eye-outline"}
										size={20}
										color="#0C2340"
									/>
								</TouchableOpacity>
							</View>
						</View>
						<View className="w-14 h-14 bg-white/30 rounded-3xl items-center justify-center border border-white/50">
							<Ionicons name="wallet" size={28} color="#0C2340" />
						</View>
					</View>

					<TouchableOpacity
						className="flex-row items-center justify-center bg-[#0C2340] py-5 rounded-[24px] gap-3 shadow-lg shadow-[#0C2340]/30"
						onPress={() => router.push("/(tabs)/(provider)/services")}
					>
						<Ionicons name="add-circle" size={24} color="#31ECC6" />
						<Text className="text-white font-black text-xs uppercase tracking-[2px]">
							Gerenciar Serviços
						</Text>
					</TouchableOpacity>
				</View>

				{/* Stats Section */}
				<View className="mb-10 flex-row gap-4">
					<View className="flex-1 border-2 border-gray-50 rounded-[28px] p-5 bg-white">
						<View className="bg-[#0C2340]/5 w-10 h-10 rounded-xl items-center justify-center mb-4">
							<Ionicons name="trending-up" size={20} color="#0C2340" />
						</View>
						<Text className="text-gray-400 text-[10px] font-black uppercase mb-1 tracking-widest">
							Ganhos Mensais
						</Text>
						<Text className="text-[#0C2340] text-lg font-black italic">
							Kz {Number(stats?.monthlyEarnings || 0).toLocaleString("pt-AO")}
						</Text>
					</View>
					<View className="flex-1 border-2 border-gray-50 rounded-[28px] p-5 bg-white">
						<View className="bg-[#31ECC6]/10 w-10 h-10 rounded-xl items-center justify-center mb-4">
							<Ionicons name="calendar" size={20} color="#31ECC6" />
						</View>
						<Text className="text-gray-400 text-[10px] font-black uppercase mb-1 tracking-widest">
							Total Reservas
						</Text>
						<Text className="text-[#0C2340] text-lg font-black italic">
							{stats?.totalReservations || 0} Atendidas
						</Text>
					</View>
				</View>

				{/* Recent Reservations */}
				<View className="mb-12">
					<View className="flex-row justify-between items-end mb-6">
						<View>
							<Text className="text-[#0C2340] text-2xl font-black uppercase italic tracking-tighter">
								Reservas
							</Text>
							<Text className="text-gray-400 text-xs mt-1 font-medium">
								Próximos compromissos na agenda
							</Text>
						</View>
						<TouchableOpacity onPress={() => router.push("/(tabs)/(provider)/reservations")}>
							<Text className="text-[#31ECC6] font-black uppercase text-[10px] tracking-widest">Ver tudo</Text>
						</TouchableOpacity>
					</View>

					{reservationsLoading ? (
						<ActivityIndicator color="#31ECC6" size="large" />
					) : recentReservations.length === 0 ? (
						<View className="border-2 border-dashed border-gray-100 rounded-[32px] py-16 items-center bg-gray-50/30">
							<Ionicons name="calendar-outline" size={48} color="#d1d5db" />
							<Text className="text-gray-400 mt-4 font-bold uppercase text-[10px] tracking-widest">Sua agenda está vazia</Text>
						</View>
					) : (
						<View className="gap-4 pb-10">
							{recentReservations.map((reservation: any) => (
								<View
									key={reservation.id}
									className="bg-white border-2 border-gray-50 rounded-[32px] p-6 flex-row items-center gap-4"
								>
									<View className="w-14 h-14 bg-[#0C2340] rounded-[20px] items-center justify-center border border-[#0C2340]">
										<Text className="text-[#31ECC6] font-black text-xl">
											{formatDate(reservation.scheduledAt).split(" ")[0]}
										</Text>
										<Text className="text-white text-[9px] font-black uppercase">
											{formatDate(reservation.scheduledAt).split(" ")[1]}
										</Text>
									</View>

									<View className="flex-1">
										<Text className="text-[#0C2340] font-black text-base" numberOfLines={1}>
											{reservation.serviceName}
										</Text>
										<Text className="text-gray-400 text-xs mt-1 font-bold">
											{reservation.client?.fullName || "Cliente Final"}
										</Text>
									</View>

									<View className="items-end">
										<Text className="text-[#0C2340] font-black text-sm">
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
												className="text-[9px] font-black uppercase"
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
