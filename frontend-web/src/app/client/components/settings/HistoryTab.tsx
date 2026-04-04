'use client';

import { Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { IReservation, ReservationStatus } from '@/types/reservation.types';

interface HistoryTabProps {
  reservations: IReservation[] | undefined;
  isLoading: boolean;
}

const statusConfig: Record<ReservationStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  'CONFIRMED': { icon: CheckCircle, color: 'text-green-600', label: 'Confirmado' },
  'PENDING': { icon: Clock, color: 'text-yellow-600', label: 'Pendente' },
  'CANCELED': { icon: AlertCircle, color: 'text-red-600', label: 'Cancelado' },
};

export function HistoryTab({ reservations, isLoading }: HistoryTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reservations?.length) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Nenhuma reserva encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => {
        const config = statusConfig[reservation.status as ReservationStatus];
        const StatusIcon = config.icon;
        const reserveDate = new Date(reservation.scheduledAt).toLocaleDateString('pt-AO');

        return (
          <div
            key={reservation.id}
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{reservation.serviceName}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{reserveDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Kz {reservation.servicePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIcon className={`w-5 h-5 ${config.color}`} />
                <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
