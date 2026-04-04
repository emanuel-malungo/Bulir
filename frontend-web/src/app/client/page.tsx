
'use client';
import { useState } from 'react';
import iconMoney from '@/assets/images/money-bag.png';
import iconWallet from '@/assets/images/wallet.png';
import Image from "next/image";
import { Plus, Search, AlertCircle, Loader, ArrowUpLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import AddBalanceModal from '@/components/layout/client/AddBalanceModal';
import { useReservations } from '@/modules/reservation/useReservation';
import { useWallet } from '@/modules/wallet/useWallet';
import { useAuthStore } from '@/modules/auth/auth.store';
import type { IReservation } from '@/modules/reservation/reservation.types';

const ReservationStatus = {
	PENDING: 'PENDING',
	CONFIRMED: 'CONFIRMED',
	CANCELED: 'CANCELED',
};

const getStatusColor = (status: string) => {
	switch (status) {
		case ReservationStatus.CONFIRMED:
			return 'bg-green-700 text-white';
		case ReservationStatus.PENDING:
			return 'bg-amber-600 text-white';
		case ReservationStatus.CANCELED:
			return 'bg-red-700 text-white';
		default:
			return 'bg-gray-700 text-white';
	}
};

const getStatusLabel = (status: string) => {
	switch (status) {
		case ReservationStatus.CONFIRMED:
			return 'Confirmada';
		case ReservationStatus.PENDING:
			return 'Pendente';
		case ReservationStatus.CANCELED:
			return 'Cancelada';
		default:
			return status;
	}
};

const getStatusIcon = (status: string) => {
	switch (status) {
		case ReservationStatus.CONFIRMED:
			return CheckCircle;
		case ReservationStatus.PENDING:
			return Clock;
		case ReservationStatus.CANCELED:
			return XCircle;
		default:
			return Clock;
	}
};

const formatDate = (isoDate: string) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (isoDate: string) => {
	const date = new Date(isoDate);
	return date.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
};

export default function ClientDashboard() {
	const { isAuthenticated } = useAuthStore();
	const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);

	// Fetch dados da API
	const { data: reservationsData, isLoading: reservationsLoading, error: reservationsError } = useReservations(
		{ limit: 6 },
		{ enabled: isAuthenticated() }
	);

	const { data: walletData, isLoading: walletLoading } = useWallet(
		{ enabled: isAuthenticated() }
	);

	const reservations: IReservation[] = reservationsData?.data || [];
	const walletBalance = walletData?.balance ?? 0;

	return (
		<div className="pb-20">
			<AddBalanceModal isOpen={isAddBalanceOpen} onClose={() => setIsAddBalanceOpen(false)} />

			<header className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8" >
				<div className="order-2 md:order-1">
					<h1 className="text-xl md:text-2xl font-medium flex items-center space-x-1" >
						<ArrowUpLeft className="w-6 h-6 text-accent " />
						<span className="hover:text-accent cursor-pointer" >Serviços reservados ({reservations.length})</span>
					</h1>
					<p className="text-xs text-gray-400" >Veja suas reservas confirmadas e pendentes</p>
				</div>
				<div className="bg-primary flex items-center justify-between rounded-xl p-5 shadow-lg order-1 md:order-2" >
					<div className="flex items-center space-x-3" >
						<div className="bg-white/10 p-2 rounded-lg">
							<Image src={iconMoney} alt="Ícone de dinheiro" width={24} height={24} />
						</div>
						<span className="text-white text-lg font-bold" >
							{walletLoading ? '...' : `Kz ${walletBalance.toLocaleString()}`}
						</span>
					</div>
					<p className="text-gray-400 text-sm font-medium" >Saldo atual</p>
				</div>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" >

				{/* Card de Carteira */}
				<div className="bg-white border border-gray-200 min-h-[300px] rounded-3xl p-8 flex items-center justify-center flex-col space-y-6  hover:shadow-md transition-shadow" >
					<Image src={iconWallet} alt="Ícone de carteira" width={140} height={140} className="mx-auto" />
					<button
						onClick={() => setIsAddBalanceOpen(true)}
						className="bg-accent hover:bg-accent/90 text-white py-3 px-8 rounded-full font-bold shadow-lg shadow-accent/20 transition-all flex items-center space-x-4 cursor-pointer"
					>
						<span>Adicionar Saldo</span><Plus className="w-5 h-5" />
					</button>
					<p className="text-gray-400 text-sm italic" >Conecte a tua carteira para reservar serviços</p>
				</div>

				{/* Histórico de Reservas */}
				<div className="bg-primary rounded-3xl text-white p-6 md:p-8 min-h-[400px] flex flex-col shadow-xl" >

					<div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5" >
						<h1 className="font-bold text-xl tracking-tight" >Histórico de Reservas</h1>
						<button className="cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/80" >
							<Search className="w-4 h-4" />
						</button>
					</div>

					<div className="flex-1 space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
						{reservationsLoading ? (
							<div className="flex flex-col items-center justify-center py-12">
								<Loader className="w-8 h-8 text-accent animate-spin mb-2" />
								<p className="text-gray-400 text-sm">Carregando...</p>
							</div>
						) : reservationsError ? (
							<div className="flex items-center gap-2 text-red-400 py-6 justify-center bg-red-400/5 rounded-xl border border-red-400/10">
								<AlertCircle className="w-4 h-4" />
								<span className="text-sm font-medium">Erro ao carregar reservas</span>
							</div>
						) : reservations.length === 0 ? (
							<div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
								<p className="text-gray-400 text-sm">Você ainda não tem reservas registradas</p>
							</div>
						) : (
							reservations.map((reservation) => {
								const StatusIcon = getStatusIcon(reservation.status);
								return (
									<div
										key={reservation.id}
										className="group transition-all bg-white/5 hover:bg-white/[0.08] p-4 rounded-2xl cursor-pointer hover:border-l-4 hover:border-accent"
									>
										<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
											<div className="flex-1">
												<h2 className="text-sm font-bold text-white mb-1 group-hover:text-accent transition-colors">{reservation.serviceName}</h2>
												<p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-3">Provedor de Serviço</p>
												<div className="flex items-center gap-3">
													<div className="flex items-center gap-1.5 text-gray-500 text-xs">
														<Clock className="w-3 h-3" />
														<span>{formatDate(reservation.scheduledAt)} • {formatTime(reservation.scheduledAt)}</span>
													</div>
												</div>
											</div>
											<div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
												<div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(reservation.status)} shadow-sm`}>
													<StatusIcon className="w-3 h-3" />
													<span>{getStatusLabel(reservation.status)}</span>
												</div>
												<span className="text-base font-black text-accent whitespace-nowrap">
													Kz {(reservation.servicePrice || 0).toLocaleString()}
												</span>
											</div>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>

			</div>

			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 4px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.05);
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 255, 255, 0.1);
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 255, 255, 0.2);
				}
			`}</style>
		</div>
	)
}