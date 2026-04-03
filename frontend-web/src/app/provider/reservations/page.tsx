'use client';
import { useState } from 'react';
import { Calendar, Clock, MapPin, Check, X, CheckCircle, AlertCircle } from "lucide-react";

const reservationRequests = [
  {
    id: 1,
    service: 'Corte de cabelo',
    client: 'João Silva',
    date: '25/04/2026',
    time: '14:30',
    location: 'Centro',
    price: 'Kz 2.500',
    status: 'pendente',
  },
  {
    id: 2,
    service: 'Limpeza residencial',
    client: 'Maria Santos',
    date: '28/04/2026',
    time: '09:00',
    location: 'Zona Sul',
    price: 'Kz 5.000',
    status: 'pendente',
  },
  {
    id: 3,
    service: 'Aula de guitarra',
    client: 'Carlos Mendes',
    date: '30/04/2026',
    time: '18:00',
    location: 'Centro',
    price: 'Kz 3.000',
    status: 'confirmada',
  },
  {
    id: 4,
    service: 'Corte de cabelo',
    client: 'Ana Costa',
    date: '01/05/2026',
    time: '15:00',
    location: 'Zona Norte',
    price: 'Kz 2.500',
    status: 'confirmada',
  },
];

const getStatusColor = (status: string) => {
  return status === "confirmada" 
    ? "bg-green-100 text-green-700" 
    : "bg-yellow-100 text-yellow-700";
};

const getStatusIcon = (status: string) => {
  return status === "confirmada" 
    ? <CheckCircle className="w-4 h-4" /> 
    : <AlertCircle className="w-4 h-4" />;
};

export default function ProviderReservations() {
  const [reservations, setReservations] = useState(reservationRequests);

  const handleConfirm = (id: number) => {
    setReservations(reservations.map(r => 
      r.id === id ? { ...r, status: 'confirmada' } : r
    ));
  };

  const handleCancel = (id: number) => {
    setReservations(reservations.map(r => 
      r.id === id ? { ...r, status: 'cancelada' } : r
    ));
  };

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
        {reservations.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Serviço</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Hora</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Localização</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Preço</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{reservation.service}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{reservation.client}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm">{reservation.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Clock className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm">{reservation.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm">{reservation.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-accent">{reservation.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="capitalize">{reservation.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {reservation.status === 'pendente' ? (
                          <>
                            <button
                              onClick={() => handleConfirm(reservation.id)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-xs font-medium flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Confirmar</span>
                            </button>
                            <button
                              onClick={() => handleCancel(reservation.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium flex items-center space-x-1"
                            >
                              <X className="w-3 h-3" />
                              <span>Recusar</span>
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
