'use client';
import { Calendar, Clock, MapPin, Check, X, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useReservations, useConfirmReservation, useCancelReservation } from '@/modules/reservation/useReservation';
import { useAuthStore } from '@/modules/auth/auth.store';
import { ReservationStatus } from '@/modules/reservation/reservation.types';

const getStatusColor = (status: string) => {
  return status === ReservationStatus.CONFIRMED
    ? "bg-green-100 text-green-700"
    : status === ReservationStatus.PENDING
    ? "bg-yellow-100 text-yellow-700"
    : "bg-red-100 text-red-700";
};

const getStatusIcon = (status: string) => {
  return status === ReservationStatus.CONFIRMED
    ? <CheckCircle className="w-4 h-4" />
    : status === ReservationStatus.PENDING
    ? <AlertCircle className="w-4 h-4" />
    : <X className="w-4 h-4" />;
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
};

export default function ProviderReservations() {
  const { user, isAuthenticated } = useAuthStore();
  const { data: reservationsData, isLoading, error } = useReservations(
    { limit: 6, providerId: user?.id },
    { enabled: isAuthenticated() && !!user?.id }
  );
  const confirmMutation = useConfirmReservation();
  const cancelMutation = useCancelReservation();

  const handleConfirm = async (id: number) => {
    try {
      await confirmMutation.mutateAsync(id);
    } catch (err) {
      console.error('Erro ao confirmar:', err);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelMutation.mutateAsync(id);
    } catch (err) {
      console.error('Erro ao cancelar:', err);
    }
  };

  const reservations = reservationsData?.data || [];

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-12 flex items-center justify-center flex-col space-y-4 min-h-80">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h2 className="text-xl font-semibold text-gray-900">Erro ao carregar reservas</h2>
        <p className="text-gray-600">{error instanceof Error ? error.message : 'Tente novamente'}</p>
      </div>
    );
  }

  return (
    <>
      <header className="grid grid-cols-2 gap-10 mb-8">
        <div>
          <h1 className="text-2xl font-medium flex items-center space-x-1">
            <Calendar className="w-6 h-6 text-accent" />
            <span>Minhas Reservas ({reservations.length})</span>
          </h1>
          <p className="text-xs text-gray-400">Gerencie pedidos de reserva e confirmadas</p>
        </div>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center flex-col space-y-4 min-h-80">
            <Loader className="w-16 h-16 text-accent animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900">Carregando reservas...</h2>
          </div>
        ) : reservations.length > 0 ? (
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
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{reservation.serviceName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm">{formatDate(reservation.scheduledAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Clock className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm">{formatTime(reservation.scheduledAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-accent">Kz {reservation.servicePrice}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="capitalize">
                          {reservation.status === ReservationStatus.CONFIRMED ? 'Confirmada' :
                           reservation.status === ReservationStatus.PENDING ? 'Pendente' :
                           'Cancelada'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {reservation.status === ReservationStatus.PENDING ? (
                          <>
                            <button
                              onClick={() => handleConfirm(reservation.id)}
                              disabled={confirmMutation.isPending}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-xs font-medium flex items-center space-x-1 disabled:opacity-50"
                            >
                              {confirmMutation.isPending ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>{confirmMutation.isPending ? 'Confirmando...' : 'Confirmar'}</span>
                            </button>
                            <button
                              onClick={() => handleCancel(reservation.id)}
                              disabled={cancelMutation.isPending}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium flex items-center space-x-1 disabled:opacity-50"
                            >
                              {cancelMutation.isPending ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              <span>{cancelMutation.isPending ? 'Recusando...' : 'Recusar'}</span>
                            </button>
                          </>
                        ) : (
                          <span className="px-3 py-1 border border-gray-300 rounded text-gray-700 text-xs font-medium">
                            -
                          </span>
                        )}
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
          </div>
        )}
      </div>
    </>
  );
}
