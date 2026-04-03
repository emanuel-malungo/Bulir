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
            </header>

            <div className="space-y-4">
                {reservas.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Serviço</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Profissional</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Hora</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Localização</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Preço</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900">{reserva.servico}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{reserva.profissional}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <Calendar className="w-4 h-4 text-accent shrink-0" />
                                                <span className="text-sm">{reserva.data}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <Clock className="w-4 h-4 text-accent shrink-0" />
                                                <span className="text-sm">{reserva.hora}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <MapPin className="w-4 h-4 text-accent shrink-0" />
                                                <span className="text-sm">{reserva.localizacao}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-accent">{reserva.preco}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(reserva.status)}`}>
                                                {getStatusIcon(reserva.status)}
                                                <span className="capitalize">{reserva.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors text-xs font-medium">
                                                    Remarcar
                                                </button>
                                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium flex items-center space-x-1">
                                                    <X className="w-3 h-3" />
                                                    <span>Cancelar</span>
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
                        <a href="/client/explore" className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                            Explorar Serviços
                        </a>
                    </div>
                )}
            </div>
        </Container>
    )
}
