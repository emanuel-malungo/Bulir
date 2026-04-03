
'use client';
import { useState } from 'react';
import iconEarnings from '@/assets/images/money-bag.png';
import iconService from '@/assets/images/service.png';
import Image from "next/image";
import { Plus, Search, TrendingUp, Clock, CheckCircle, XCircle }  from "lucide-react";

const upcomingReservations = [
  {
    id: 1,
    service: 'Corte de cabelo',
    client: 'João Silva',
    date: '25 Mar 2026',
    time: '14:30',
    price: 2500,
    status: 'confirmada',
  },
  {
    id: 2,
    service: 'Limpeza residencial',
    client: 'Maria Santos',
    date: '28 Mar 2026',
    time: '09:00',
    price: 5000,
    status: 'pendente',
  },
  {
    id: 3,
    service: 'Aula de guitarra',
    client: 'Carlos Mendes',
    date: '30 Mar 2026',
    time: '18:00',
    price: 3000,
    status: 'confirmada',
  },
];

const getStatusColor = (status: string) => {
  switch(status) {
    case 'confirmada':
      return 'bg-green-700 text-white';
    case 'pendente':
      return 'bg-amber-600 text-white';
    case 'cancelada':
      return 'bg-red-700 text-white';
    default:
      return 'bg-gray-700 text-white';
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'confirmada':
      return CheckCircle;
    case 'pendente':
      return Clock;
    case 'cancelada':
      return XCircle;
    default:
      return Clock;
  }
};

export default function ProviderDashboard() {
    return (
        <>
            <header className="grid grid-cols-2 gap-10 mb-8" >
                <div>
                    <h1 className="text-2xl font-medium flex items-center space-x-1" ><TrendingUp className="w-6 h-6 text-accent " /> <span className="hover:text-accent cursor-pointer" >Total de reservas (12)</span></h1>
                    <p className="text-xs text-gray-400" >Gerencie suas reservas e ganhos</p>
                </div>
                <div className="bg-primary flex items-center justify-between rounded-lg p-4" >
                    <div className="flex items-center space-x-2" >
                        <Image src={iconEarnings} alt="Ícone de ganhos" width={24} height={24} />
                        <span className="text-white font-medium" >Kz 45.500</span>
                    </div>
                    <p className="text-gray-300" >Ganhos este mês</p>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-12" >

                <div className="border border-gray-200 min-h-100 rounded-lg p-4 flex items-center justify-center flex-col space-y-4" >
                    <Image src={iconService} alt="Ícone de serviço" width={150} height={150} className="mx-auto" />
                    <button 
                      className="border-2 border-accent py-2 px-4 rounded-sm cursor-pointer flex items-center space-x-4 hover:bg-accent/10 transition-colors" 
                    >
                        <span>Criar Serviço</span><Plus className="w-4 h-4 text-accent" />
                    </button>
                    <p className="text-gray-300 text-sm" >Adicione novos serviços ao seu portfólio</p>
                </div>

                <div className="bg-primary rounded-lg text-white p-8 min-h-80" >
                
                    <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4" >
                        <h1 className="font-bold text-lg"  >Próximas Reservas</h1>
                        <button className="cursor-pointer p-2 rounded-full bg-accent hover:bg-opacity-80 transition-all" >
                            <Search className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 reservation-scroll">
                        {upcomingReservations.map((reservation) => {
                          const StatusIcon = getStatusIcon(reservation.status);
                          return (
                            <div 
                              key={reservation.id}
                              className="transition-all border-b border-gray-700 pb-4 cursor-pointer hover:pl-2" 
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-sm font-semibold text-white">{reservation.service}</h2>
                                  </div>
                                  <p className="text-gray-400 text-xs mb-2">Cliente: {reservation.client}</p>
                                  <span className="text-xs text-gray-500">{reservation.date} • {reservation.time}</span>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    <span className="capitalize">{reservation.status}</span>
                                  </div>
                                  <span className="text-sm font-bold text-accent whitespace-nowrap">Kz {reservation.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                </div>

            </div>
        </>
    )
}