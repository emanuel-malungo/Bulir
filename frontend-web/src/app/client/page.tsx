'use client';
import iconMoney from '@/assets/images/money-bag.png';
import iconWallet from '@/assets/images/wallet.png';
import Image from "next/image";
// lucide icons icon add +
import { Plus, Search,  ArrowUpLeft, Clock, CheckCircle, XCircle }  from "lucide-react";

const reservationHistory = [
  {
    id: 1,
    service: 'Corte de cabelo',
    provider: 'João Silva',
    date: '25 Mar 2026',
    time: '14:30',
    price: 2500,
    status: 'confirmada',
  },
  {
    id: 2,
    service: 'Limpeza residencial',
    provider: 'Maria Santos',
    date: '28 Mar 2026',
    time: '09:00',
    price: 5000,
    status: 'pendente',
  },
  {
    id: 3,
    service: 'Aula de guitarra',
    provider: 'Carlos Mendes',
    date: '20 Mar 2026',
    time: '18:00',
    price: 3000,
    status: 'cancelada',
  },
  {
    id: 4,
    service: 'Manutenção de computador',
    provider: 'Tech Solutions',
    date: '01 Abr 2026',
    time: '15:30',
    price: 8000,
    status: 'confirmada',
  },
];

const getStatusColor = (status: string) => {
  switch(status) {
    case 'confirmada':
      return 'bg-green-600 text-white';
    case 'pendente':
      return 'bg-yellow-500 text-white';
    case 'cancelada':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-600 text-white';
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

export default function ClientDashboard() {
    return (
        <>
            <header className="grid grid-cols-2 gap-10 mb-8" >
                <div>
                    <h1 className="text-2xl font-medium flex items-center space-x-1" ><ArrowUpLeft className="w-6 h-6 text-accent " /> <span className="hover:text-accent cursor-pointer" >Serviços reservados (0)</span></h1>
                    <p className="text-xs text-gray-400" >Veja o que preparamos para você hoje</p>
                </div>
                <div className="bg-primary flex items-center justify-between rounded-lg p-4" >
                    <div className="flex items-center space-x-2" >
                        <Image src={iconMoney} alt="Ícone de dinheiro" width={24} height={24} />
                        <span className="text-white font-medium" >Kz0.00</span>
                    </div>
                    <p className="text-gray-300" >Saldo atual</p>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-12" >

                <div className="border border-gray-200 min-h-100 rounded-lg p-4 flex items-center justify-center flex-col space-y-4" >
                    <Image src={iconWallet} alt="Ícone de carteira" width={150} height={150} className="mx-auto" />
                    <button className="border-2  py-2 px-4 rounded-sm cursor-pointer flex items-center space-x-4" >
                        <span>Adicionar Saldo</span><Plus className="w-4 h-4 text-accent" />
                    </button>
                    <p className="text-gray-300 text-sm" >Conecte a tua carteira para reservas serviço</p>
                </div>

                <div className="bg-primary rounded-lg text-white p-8 min-h-80" >
                
                    <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4" >
                        <h1 className="font-bold text-lg"  >Histórico de Reservas</h1>
                        <button className="cursor-pointer p-2 rounded-full bg-accent hover:bg-opacity-80 transition-all" >
                            <Search className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 reservation-scroll">
                        {reservationHistory.map((reservation) => {
                          const StatusIcon = getStatusIcon(reservation.status);
                          return (
                            <div 
                              key={reservation.id}
                              className="transition-all border-b border-gray-700 pb-4 cursor-pointer" 
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-sm font-semibold text-white">{reservation.service}</h2>
                                  </div>
                                  <p className="text-gray-400 text-xs mb-2">{reservation.provider}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{reservation.date} • {reservation.time}</span>
                                    <span className="text-sm font-bold text-accent">Kz {reservation.price.toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    <span className="capitalize">{reservation.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <style jsx>{`
                      .reservation-scroll::-webkit-scrollbar {
                        width: 6px;
                      }
                      .reservation-scroll::-webkit-scrollbar-track {
                        background: #1f2937;
                        border-radius: 10px;
                      }
                      .reservation-scroll::-webkit-scrollbar-thumb {
                        background: #4b5563;
                        border-radius: 10px;
                      }
                      .reservation-scroll::-webkit-scrollbar-thumb:hover {
                        background: #6b7280;
                      }
                    `}</style>
                </div>

            </div>
        </>
    )
}