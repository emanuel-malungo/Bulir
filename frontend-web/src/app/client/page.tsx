'use client';
import { useState } from 'react';
import iconMoney from '@/assets/images/money-bag.png';
import iconWallet from '@/assets/images/wallet.png';
import Image from "next/image";
import { Plus, Search, AlertCircle, Loader, ArrowUpLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import AddBalanceModal from '@/app/components/layout/client/AddBalanceModal';
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
  switch(status) {
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
  switch(status) {
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
  switch(status) {
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
      { limit: 50 },
      { enabled: isAuthenticated() }
    );
    
    const { data: walletData, isLoading: walletLoading } = useWallet(
      { enabled: isAuthenticated() }
    );

    const reservations: IReservation[] = reservationsData?.data || [];
    const walletBalance = walletData?.balance ?? 0;

    return (
        <>
            <AddBalanceModal isOpen={isAddBalanceOpen} onClose={() => setIsAddBalanceOpen(false)} />
            <header className="grid grid-cols-2 gap-10 mb-8" >
                <div>
                    <h1 className="text-2xl font-medium flex items-center space-x-1" >
                        <ArrowUpLeft className="w-6 h-6 text-accent " /> 
                        <span className="hover:text-accent cursor-pointer" >Serviços reservados ({reservations.length})</span>
                    </h1>
                    <p className="text-xs text-gray-400" >Veja suas reservas confirmadas e pendentes</p>
                </div>
                <div className="bg-primary flex items-center justify-between rounded-lg p-4" >
                    <div className="flex items-center space-x-2" >
                        <Image src={iconMoney} alt="Ícone de dinheiro" width={24} height={24} />
                        <span className="text-white font-medium" >
                            {walletLoading ? '...' : `Kz ${walletBalance.toLocaleString()}`}
                        </span>
                    </div>
                    <p className="text-gray-300" >Saldo atual</p>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-12" >

                <div className="border border-gray-200 min-h-100 rounded-lg p-4 flex items-center justify-center flex-col space-y-4" >
                    <Image src={iconWallet} alt="Ícone de carteira" width={150} height={150} className="mx-auto" />
                    <button 
                      onClick={() => setIsAddBalanceOpen(true)}
                      className="border-2 border-accent py-2 px-4 rounded-sm cursor-pointer flex items-center space-x-4 hover:bg-accent/10 transition-colors" 
                    >
                        <span>Adicionar Saldo</span><Plus className="w-4 h-4 text-accent" />
                    </button>
                    <p className="text-gray-300 text-sm" >Conecte a tua carteira para reservar serviços</p>
                </div>

                <div className="bg-primary rounded-lg text-white p-8 min-h-80" >
                
                    <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4" >
                        <h1 className="font-bold text-lg"  >Histórico de Reservas</h1>
                        <button className="cursor-pointer p-2 rounded-full bg-accent hover:bg-opacity-80 transition-all" >
                            <Search className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 reservation-scroll">
                        {reservationsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader className="w-6 h-6 text-accent animate-spin" />
                          </div>
                        ) : reservationsError ? (
                          <div className="flex items-center gap-2 text-red-400 py-4">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">Erro ao carregar reservas</span>
                          </div>
                        ) : reservations.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-400 text-sm">Você ainda não tem reservas</p>
                          </div>
                        ) : (
                          reservations.map((reservation) => {
                            const StatusIcon = getStatusIcon(reservation.status);
                            return (
                              <div 
                                key={reservation.id}
                                className="transition-all border-b border-gray-700 pb-4 cursor-pointer hover:pl-2" 
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h2 className="text-sm font-semibold text-white">{reservation.serviceName}</h2>
                                    </div>
                                    <p className="text-gray-400 text-xs mb-3">Provedor</p>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(reservation.scheduledAt)} • {formatTime(reservation.scheduledAt)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-end gap-3">
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                                      <StatusIcon className="w-3 h-3" />
                                      <span>{getStatusLabel(reservation.status)}</span>
                                    </div>
                                    <span className="text-sm font-bold text-accent whitespace-nowrap">
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
        </>
    )
}