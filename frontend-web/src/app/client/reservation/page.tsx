"use client";

import { Calendar, Clock, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
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

    const reservas: IReservation[] = reservasData || [];

    const cancelMutation = useMutation({
        mutationFn: async (reservationId: number) => {
            await api.delete(`/reservations/${reservationId}`);
        },
        onSuccess: () => {
            refetch();
        },
    });

    const getStatusColor = (status: string) => {
        const statusMap: { [key: string]: string } = {
            CONFIRMED: "bg-green-100 text-green-700",
            PENDING: "bg-yellow-100 text-yellow-700",
            CANCELED: "bg-red-100 text-red-700",
        };
        return statusMap[status] || "bg-gray-100 text-gray-700";
    };

    const getStatusIcon = (status: string) => {
        return status === "CONFIRMED" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
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
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <>
            <header className="grid grid-cols-2 gap-10 mb-8">
                <div>
                    <h1 className="text-2xl font-medium flex items-center space-x-1">
                        <Calendar className="w-6 h-6 text-accent" />
                        <span>Minhas Reservas ({reservas.length})</span>
                    </h1>
                    <p className="text-xs text-gray-400">Acompanhe suas reservas agendadas</p>
                </div>
            </header>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    </div>
                ) : error ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center flex-col space-y-4 min-h-80">
                        <AlertCircle className="w-16 h-16 text-red-300" />
                        <h2 className="text-xl font-semibold text-gray-900">Erro ao carregar reservas</h2>
                        <p className="text-gray-600">Tente recarregar a página</p>
                        <button 
                            onClick={() => refetch()}
                            className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                ) : reservas.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Serviço</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Hora</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Preço</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900">{reserva.serviceName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <Calendar className="w-4 h-4 text-accent shrink-0" />
                                                <span className="text-sm">{formatDate(reserva.scheduledAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <Clock className="w-4 h-4 text-accent shrink-0" />
                                                <span className="text-sm">{formatTime(reserva.scheduledAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-accent">{reserva.servicePrice}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(reserva.status)}`}>
                                                {getStatusIcon(reserva.status)}
                                                <span className="capitalize">
                                                    {reserva.status === "CONFIRMED" ? "Confirmada" : 
                                                     reserva.status === "PENDING" ? "Pendente" : 
                                                     "Cancelada"}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => cancelMutation.mutate(reserva.id)}
                                                    disabled={reserva.status === "CANCELED" || cancelMutation.isPending}
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <X className="w-3 h-3" />
                                                    <span>{cancelMutation.isPending ? "Cancelando..." : "Cancelar"}</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center flex-col space-y-4 min-h-80">
                        <Calendar className="w-16 h-16 text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-900">Nenhuma reserva encontrada</h2>
                        <p className="text-gray-600">Você ainda não possui reservas agendadas</p>
                        <a href="/client/services" className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                            Explorar Serviços
                        </a>
                    </div>
                )}
            </div>
        </>
    )
}
