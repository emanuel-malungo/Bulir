import Container from "../../components/layout/Container"
import iconMoney from '@/assets/images/money-bag.png';
import Image from "next/image";
import { Calendar, Clock, MapPin, X, CheckCircle, AlertCircle } from "lucide-react";

export default function ReservasPage() {
    // Mock data for reservations
    const reservas = [
        {
            id: 1,
            servico: "Corte de cabelo",
            profissional: "João Silva",
            data: "05/04/2026",
            hora: "14:30",
            localizacao: "Centro",
            preco: "Kz 2.00",
            status: "confirmada"
        },
        {
            id: 2,
            servico: "Limpeza facial",
            profissional: "Maria Santos",
            data: "06/04/2026",
            hora: "10:00",
            localizacao: "Zona Sul",
            preco: "Kz 3.50",
            status: "confirmada"
        },
        {
            id: 3,
            servico: "Massagem relaxante",
            profissional: "Carlos Mendes",
            data: "07/04/2026",
            hora: "16:00",
            localizacao: "Centro",
            preco: "Kz 5.00",
            status: "pendente"
        }
    ];

    const getStatusColor = (status: string) => {
        return status === "confirmada" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";
    };

    const getStatusIcon = (status: string) => {
        return status === "confirmada" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
    };

    return (
        <Container>
            <header className="grid grid-cols-2 gap-10 mb-8">
                <div>
                    <h1 className="text-2xl font-medium flex items-center space-x-1">
                        <Calendar className="w-6 h-6 text-accent" />
                        <span>Minhas Reservas ({reservas.length})</span>
                    </h1>
                    <p className="text-xs text-gray-400">Acompanhe suas reservas agendadas</p>
                </div>
                <div className="bg-accent flex items-center justify-between rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <Image src={iconMoney} alt="Ícone de dinheiro" width={24} height={24} />
                        <span className="text-white font-medium">Kz 0.00</span>
                    </div>
                    <p className="text-white/80">Saldo atual</p>
                </div>
            </header>

            <div className="space-y-4">
                {reservas.length > 0 ? (
                    reservas.map((reserva) => (
                        <div key={reserva.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{reserva.servico}</h2>
                                    <p className="text-sm text-gray-600">Profissional: {reserva.profissional}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(reserva.status)}`}>
                                    {getStatusIcon(reserva.status)}
                                    <span className="capitalize">{reserva.status}</span>
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-gray-200">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-sm">{reserva.data}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-sm">{reserva.hora}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-sm">{reserva.localizacao}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-accent">{reserva.preco}</span>
                                <div className="flex items-center space-x-2">
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                                        Remarcar
                                    </button>
                                    <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center space-x-1">
                                        <X className="w-4 h-4" />
                                        <span>Cancelar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center flex-col space-y-4 min-h-80">
                        <Calendar className="w-16 h-16 text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-900">Nenhuma reserva encontrada</h2>
                        <p className="text-gray-600">Você ainda não possui reservas agendadas</p>
                        <a href="/client/explore" className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                            Explorar Serviços
                        </a>
                    </div>
                )}
            </div>
        </Container>
    )
}
