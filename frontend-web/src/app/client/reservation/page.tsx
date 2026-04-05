"use client";

import { Calendar, Clock, X, CheckCircle, AlertCircle, Loader2, CalendarClock, Trash2, ArrowRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import api from "@/utils/api.utils";
import { useAuthStore } from "@/modules/auth/auth.store";
import { IReservation } from "@/types/reservation.types";

export default function ReservasPage() {
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch reservations
    const { data: reservasData, isLoading, error, refetch } = useQuery({
        queryKey: ["client-reservations"],
        queryFn: async () => {
            const response = await api.get("/reservations");
            return response.data.data || [];
        },
        enabled: mounted && !!user,
    });

    const reservas: IReservation[] = (reservasData || []).reverse();

    const cancelMutation = useMutation({
        mutationFn: async (reservationId: number) => {
            await api.delete(`/reservations/${reservationId}`);
        },
        onSuccess: () => {
            refetch();
        },
    });

    const getStatusStyle = (status: string) => {
        const styles: { [key: string]: string } = {
            CONFIRMED: "bg-green-50 text-green-600 border-green-100",
            PENDING: "bg-yellow-50 text-yellow-600 border-yellow-100",
            CANCELED: "bg-red-50 text-red-600 border-red-100",
        };
        return styles[status] || "bg-gray-50 text-gray-500 border-gray-100";
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("pt-AO", { day: "2-digit", month: "2-digit", year: "numeric" });
        } catch {
            return dateString;
        }
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" });
        } catch {
            return dateString;
        }
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header com Ações — Estilo Unificado Admin */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mt-2 px-2">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Minhas Reservas</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Bulir User Appointments Control</p>
                </div>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-50/50 transition-all hover:shadow-xl hover:shadow-gray-200/20">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Serviço</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 font-mono italic">Agendamento</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Preço</th>
                                <th className="px-8 py-5 border-b border-gray-100 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-accent animate-spin"></div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">Sincronizando Reservas...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-red-400 text-[11px] font-bold uppercase tracking-widest italic opacity-60">
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> Erro ao carregar agendamentos
                                        </div>
                                    </td>
                                </tr>
                            ) : reservas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 py-8">
                                            <CalendarClock className="w-12 h-12 text-gray-100" />
                                            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest italic opacity-50">Nenhuma reserva agendada</p>
                                            <a href="/client/services" className="px-6 py-2 bg-accent/5 text-accent border border-accent/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95">Explorar Catálogo</a>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reservas.map((reserva) => (
                                    <tr key={reserva.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs shadow-sm group-hover:scale-110 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                                                    {reserva.serviceName.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-accent transition-colors">{reserva.serviceName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-700">{formatDate(reserva.scheduledAt)}</span>
                                                <span className="text-[10px] text-gray-400 font-medium mt-1 italic">{formatTime(reserva.scheduledAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${getStatusStyle(reserva.status)}`}>
                                                <div className="w-1 h-1 rounded-full bg-current mr-2" />
                                                {reserva.status === "CONFIRMED" ? "Confirmada" : 
                                                 reserva.status === "PENDING" ? "Pendente" : 
                                                 "Cancelada"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-sm font-black text-gray-900 tabular-nums italic">
                                                Kz {reserva.servicePrice?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end">
                                                <button 
                                                    disabled={reserva.status === "CANCELED" || cancelMutation.isPending}
                                                    onClick={() => cancelMutation.mutate(reserva.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all disabled:opacity-0 group-hover:opacity-100 opacity-0"
                                                    title="Cancelar Reserva"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Rodapé da Tabela */}
                <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Histórico Completo de Agendamentos</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                        {reservas.length} Transações Registradas
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
