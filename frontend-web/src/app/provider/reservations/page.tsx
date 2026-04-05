'use client';
import { Calendar, Clock, Check, X, CheckCircle, AlertCircle, Loader2, CalendarClock, Package, Search } from "lucide-react";
import { useReservations, useConfirmReservation, useCancelReservation } from '@/modules/reservation/useReservation';
import { useAuthStore } from '@/modules/auth/auth.store';
import { ReservationStatus } from '@/modules/reservation/reservation.types';
import { useState, useEffect } from "react";

const getStatusStyle = (status: string) => {
    switch (status) {
        case ReservationStatus.CONFIRMED:
            return "bg-green-50 text-green-600 border-green-100";
        case ReservationStatus.PENDING:
            return "bg-amber-50 text-amber-600 border-amber-100";
        case ReservationStatus.CANCELED:
            return "bg-red-50 text-red-600 border-red-100";
        default:
            return "bg-gray-50 text-gray-400 border-gray-100";
    }
};

const formatDate = (isoDate: string) => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return isoDate; }
};

const formatTime = (isoDate: string) => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
  } catch { return isoDate; }
};

export default function ProviderReservations() {
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: reservationsData, isLoading, error, refetch } = useReservations(
    { limit: 50, providerId: user?.id },
    { enabled: mounted && isAuthenticated() && !!user?.id }
  );

  const confirmMutation = useConfirmReservation();
  const cancelMutation = useCancelReservation();

  const handleConfirm = async (id: number) => {
    try {
      await confirmMutation.mutateAsync(id);
      await refetch();
    } catch (err) {
      console.error('Erro ao confirmar:', err);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelMutation.mutateAsync(id);
      await refetch();
    } catch (err) {
      console.error('Erro ao cancelar:', err);
    }
  };

  const reservations = reservationsData?.data || [];

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Sincronizado — Estilo Client/Admin */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200 mt-2 px-2">
          <div className="space-y-1">
              <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-2">
                  Gestão de Reserva
              </h1>
          </div>

          <div className="flex items-center gap-3">
              <div className="relative group w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-accent transition-all pl-0.5" />
                  <input
                      type="text"
                      placeholder="PESQUISAR CLIENTE OU DATA..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] focus:ring-4 focus:ring-accent/5 focus:border-accent/30 transition-all outline-none text-gray-900 font-black placeholder:text-gray-300 placeholder:font-bold tracking-widest"
                  />
              </div>
          </div>
      </div>

      <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-none transition-all">
          <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                  <thead>
                      <tr className="bg-gray-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 italic">Serviço Agendado</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 italic">Agendamento</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 italic">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 italic text-right">Valor</th>
                          <th className="px-8 py-5 border-b border-gray-100 text-right"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {isLoading ? (
                          <tr>
                              <td colSpan={5} className="px-8 py-24 text-center">
                                  <div className="flex flex-col items-center gap-3">
                                      <Loader2 className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-accent animate-spin" />
                                      <p className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">Sincronizando Pedidos...</p>
                                  </div>
                              </td>
                          </tr>
                      ) : error ? (
                          <tr>
                              <td colSpan={5} className="px-8 py-16 text-center text-red-400 text-[11px] font-black uppercase tracking-widest italic opacity-60">
                                  <div className="flex items-center justify-center gap-2">
                                      <AlertCircle className="w-5 h-5" /> Erro ao carregar agendamentos
                                  </div>
                              </td>
                          </tr>
                      ) : reservations.length === 0 ? (
                          <tr>
                              <td colSpan={5} className="px-8 py-24 text-center">
                                  <div className="flex flex-col items-center gap-5 py-8">
                                      <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                                          <CalendarClock className="w-8 h-8 text-gray-200" />
                                      </div>
                                      <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest italic px-8 max-w-xs leading-relaxed">Ainda não recebeu pedidos de reserva no seu catálogo activo.</p>
                                  </div>
                              </td>
                          </tr>
                      ) : (
                          reservations.map((reserva) => (
                              <tr key={reserva.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                                  <td className="px-8 py-6">
                                      <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center font-black text-accent text-sm shadow-inner group-hover:scale-110 transition-all italic">
                                              {reserva.serviceName.charAt(0)}
                                          </div>
                                          <div className="flex flex-col gap-1">
                                              <span className="text-sm font-black text-gray-900 leading-tight uppercase group-hover:text-accent transition-colors italic">{reserva.serviceName}</span>
                                              <span className="text-[10px] text-gray-400 font-bold italic opacity-60">Cliente: João Pedro</span>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <div className="flex flex-col gap-1">
                                          <span className="text-xs font-black text-gray-700 italic tracking-tight">{formatDate(reserva.scheduledAt)}</span>
                                          <span className="text-[10px] text-accent font-black uppercase tracking-widest italic">{formatTime(reserva.scheduledAt)}</span>
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <span className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(reserva.status)}`}>
                                          <div className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                                          {reserva.status === ReservationStatus.CONFIRMED ? "Confirmada" : 
                                           reserva.status === ReservationStatus.PENDING ? "Pendente" : 
                                           "Cancelada"}
                                      </span>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                      <span className="text-sm font-black text-gray-900 tabular-nums italic tracking-tighter">
                                          Kz {Number(reserva.servicePrice).toLocaleString('pt-AO')}
                                      </span>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                          {reserva.status === ReservationStatus.PENDING ? (
                                              <div className="flex items-center gap-2">
                                                  <button
                                                      onClick={() => handleConfirm(reserva.id)}
                                                      disabled={confirmMutation.isPending}
                                                      className="p-2.5 bg-green-50 text-green-600 border border-green-100 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                      title="Aceitar Pedido"
                                                  >
                                                      {confirmMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                  </button>
                                                  <button
                                                      onClick={() => handleCancel(reserva.id)}
                                                      disabled={cancelMutation.isPending}
                                                      className="p-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                      title="Recusar"
                                                  >
                                                      {cancelMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                  </button>
                                              </div>
                                          ) : (
                                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Finalizada</span>
                                          )}
                                      </div>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>

          <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/10">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Sistema de Agendamento Sincronizado</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                  {reservations.length} Pedidos Processados
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
      `}</style>
    </div>
  );
}
