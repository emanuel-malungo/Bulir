
'use client';
import { useState } from 'react';
import iconWallet from '@/assets/images/wallet.png';
import Image from "next/image";
import { Plus, Search, AlertCircle, Loader, Clock, CheckCircle, XCircle, ArrowRight, Wallet, Calendar, Filter, MoreHorizontal } from "lucide-react";
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
			return 'bg-green-50 text-green-600 border border-green-100';
		case ReservationStatus.PENDING:
			return 'bg-amber-50 text-amber-600 border border-amber-100';
		case ReservationStatus.CANCELED:
			return 'bg-red-50 text-red-600 border border-red-100';
		default:
			return 'bg-gray-50 text-gray-600 border border-gray-100';
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

const formatDate = (isoDate: string) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (isoDate: string) => {
	const date = new Date(isoDate);
	return date.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
};

export default function ClientDashboard() {
	const { isAuthenticated, user } = useAuthStore();
	const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	// Fetch dados da API
	const { data: reservationsData, isLoading: reservationsLoading, error: reservationsError } = useReservations(
		{ limit: 10 },
		{ enabled: isAuthenticated() }
	);

	const { data: walletData, isLoading: walletLoading } = useWallet({ 
        enabled: isAuthenticated() 
    });

	const reservations: IReservation[] = reservationsData?.data || [];
	const walletBalance = walletData?.balance ?? 0;

	return (
		<div className="space-y-8 animate-in fade-in duration-700">
			<AddBalanceModal isOpen={isAddBalanceOpen} onClose={() => setIsAddBalanceOpen(false)} />

			{/* Header Sincronizado com Admin Design */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mt-2">
				<div className="space-y-1">
					<h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
						Dashboard do Cliente
					</h1>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3">
					<div className="relative group w-full sm:w-72">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-accent transition-all shadow-sm" />
						<input
							type="text"
							placeholder="Pesquisar reservas..."
							className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] focus:ring-2 focus:ring-accent/5 focus:border-accent/30 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<button 
						onClick={() => setIsAddBalanceOpen(true)}
						className="h-10 flex items-center justify-center bg-accent text-white rounded-xl text-[11px] font-bold px-6 whitespace-nowrap w-full sm:w-auto hover:scale-[1.02] transition-transform uppercase tracking-widest"
					>
						<Plus className="w-3.5 h-3.5 mr-2" /> Adicionar Saldo
					</button>
				</div>
			</div>

			{/* Cartões de Visão Geral — Estilo Admin Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Saldo — Estilo Admin Card */}
				<div className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm shadow-gray-100/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40">
					<div className="flex items-center justify-between relative z-10">
						<div className="space-y-4">
							<div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:rotate-6 transition-transform">
								<Wallet className="w-6 h-6" />
							</div>
							<div>
								<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Saldo Disponível</p>
								<h3 className="text-2xl font-black text-gray-900 tabular-nums">
									{walletLoading ? '...' : `Kz ${walletBalance.toLocaleString()}`}
								</h3>
							</div>
						</div>
						<div className="w-24 h-24 flex items-center justify-center">
							<Image src={iconWallet} alt="Wallet" width={80} height={80} className="grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110" />
						</div>
					</div>
					<div className="mt-6 flex items-center text-[10px] font-bold text-green-500 bg-green-50/50 px-3 py-1.5 rounded-lg w-fit border border-green-100/50">
						CARTEIRA VERIFICADA
					</div>
				</div>

				{/* Reservas Status — Estilo Admin Card */}
				<div className="group relative bg-gray-900 border border-white/5 rounded-2xl p-6 shadow-2xl shadow-black/10 overflow-hidden transition-all duration-300">
					<div className="flex items-center justify-between relative z-10">
						<div className="space-y-4">
							<div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
								<Calendar className="w-6 h-6" />
							</div>
							<div>
								<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Serviços Utilizados</p>
								<h3 className="text-2xl font-black text-white tabular-nums italic">
									{reservationsLoading ? '...' : reservations.length} Reservas
								</h3>
							</div>
						</div>
						<div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-accent group-hover:text-white transition-all cursor-pointer">
							<ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white" />
						</div>
					</div>
					{/* Abstract Pattern overlay */}
					<div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[80px] -mr-16 -mt-16" />
				</div>
			</div>

			{/* Tabela de Reservas — Sincronizada com User Management do Admin */}
			<div className="space-y-4">
				<div className="px-2">
					<h1 className="text-xl font-bold text-gray-900 tracking-tight">Histórico de Reservas</h1>
				</div>

				<div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-50/50 transition-all hover:shadow-xl hover:shadow-gray-200/20">
					<div className="overflow-x-auto custom-scrollbar">
						<table className="w-full text-left whitespace-nowrap">
							<thead>
								<tr className="bg-gray-50/30">
									<th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Serviço</th>
									<th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Agendamento</th>
									<th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
									<th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Valor</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{reservationsLoading ? (
									<tr>
										<td colSpan={4} className="px-8 py-20 text-center">
											<div className="flex flex-col items-center gap-3">
												<div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-accent animate-spin"></div>
												<p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Sincronizando Reservas...</p>
											</div>
										</td>
									</tr>
								) : reservationsError ? (
									<tr>
										<td colSpan={4} className="px-8 py-16 text-center">
											<div className="text-red-400 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
												<AlertCircle className="w-4 h-4" /> Erro ao carregar histórico
											</div>
										</td>
									</tr>
								) : reservations.length === 0 ? (
									<tr>
										<td colSpan={4} className="px-8 py-20 text-center">
											<p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest italic opacity-50">Nenhuma reserva encontrada</p>
										</td>
									</tr>
								) : (
									reservations.map((reservation) => (
										<tr key={reservation.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
											<td className="px-8 py-5">
												<div className="flex items-center gap-4">
													<div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs shadow-sm group-hover:scale-110 transition-all">
														{reservation.serviceName.charAt(0)}
													</div>
													<div className="flex flex-col">
														<span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-accent transition-colors">{reservation.serviceName}</span>
													</div>
												</div>
											</td>
											<td className="px-8 py-5">
												<div className="flex flex-col">
													<span className="text-xs font-bold text-gray-700">{formatDate(reservation.scheduledAt)}</span>
													<span className="text-[10px] text-gray-400 font-medium mt-1">{formatTime(reservation.scheduledAt)}</span>
												</div>
											</td>
											<td className="px-8 py-5">
												<span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(reservation.status)}`}>
													<div className="w-1 h-1 rounded-full bg-current mr-2" />
													{getStatusLabel(reservation.status)}
												</span>
											</td>
											<td className="px-8 py-5 text-right">
												<span className="text-sm font-black text-gray-900 tabular-nums italic">
													Kz {reservation.servicePrice?.toLocaleString()}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Rodapé da Tabela */}
					<div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
						<p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Sincronizado em Tempo Real</p>
						<button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-accent transition-all flex items-center gap-2 group italic">
							Ver todo o histórico <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>
				</div>
			</div>

			<style jsx global>{`
				.custom-scrollbar::-webkit-scrollbar {
					height: 6px;
					width: 4px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #f1f1f1;
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #e5e5e5;
				}
			`}</style>
		</div>
	);
}