
import Container from "../components/layout/Container"
import iconMoney from '@/assets/images/money-bag.png';
import iconWallet from '@/assets/images/wallet.png';
import Image from "next/image";
// lucide icons icon add +
import { Plus, Search,  ArrowUpLeft }  from "lucide-react";

export default function ClientDashboard() {
    return (
        <Container>
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
                
                    <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-4" >
                        <h1 className="font-bold"  >Lista de Serviços</h1>
                        <button className="cursor-pointer p-2 rounded-full bg-accent" >
                            <Search className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="border-b border-gray-600 py-4 flex flex-col justify-between" >
                        <div>
                            <h2 className="text-lg font-semibold mb-1" >Corte de cabelo</h2>
                            <p className="text-gray-300 text-sm mb-3" >Serviço de corte profissional</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-white">Kz 2.00</span>
                            <button className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 transition-colors flex items-center justify-center" title="Reservar">
                                <Plus className="w-5 h-5 text-accent" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </Container>
    )
}