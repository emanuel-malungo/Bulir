
'use client';
import { useState } from 'react';
import iconEarnings from '@/assets/images/money-bag.png';
import iconService from '@/assets/images/service.png';
import Image from "next/image";
import { Plus, Search, TrendingUp, Edit2, Trash2 }  from "lucide-react";
import CreateServiceModal from '@/app/components/layout/provider/CreateServiceModal';

const myServices = [
  {
    id: 1,
    name: 'Corte de cabelo',
    category: 'Beleza',
    description: 'Serviço de corte profissional com produtos de qualidade',
    price: 2500,
  },
  {
    id: 2,
    name: 'Limpeza residencial',
    category: 'Limpeza',
    description: 'Limpeza completa da sua casa com eficiência',
    price: 5000,
  },
  {
    id: 3,
    name: 'Aula de guitarra',
    category: 'Educação',
    description: 'Aulas particulares de guitarra para iniciantes e avançados',
    price: 3000,
  },
  {
    id: 4,
    name: 'Reparo de computador',
    category: 'Tecnologia',
    description: 'Conserto e manutenção de computadores e notebooks',
    price: 4000,
  },
];

export default function ProviderDashboard() {
    const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
    return (
        <>
            <CreateServiceModal isOpen={isCreateServiceOpen} onClose={() => setIsCreateServiceOpen(false)} />
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
                      onClick={() => setIsCreateServiceOpen(true)}
                      className="border-2 border-accent py-2 px-4 rounded-sm cursor-pointer flex items-center space-x-4 hover:bg-accent/10 transition-colors" 
                    >
                        <span>Criar Serviço</span><Plus className="w-4 h-4 text-accent" />
                    </button>
                    <p className="text-gray-300 text-sm" >Adicione novos serviços ao seu portfólio</p>
                </div>

                <div className="bg-primary rounded-lg text-white p-8 min-h-80" >
                
                    <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4" >
                        <h1 className="font-bold text-lg"  >Meus Serviços</h1>
                        <button className="cursor-pointer p-2 rounded-full bg-accent hover:bg-opacity-80 transition-all" >
                            <Search className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 reservation-scroll">
                        {myServices.map((service) => {
                          return (
                            <div 
                              key={service.id}
                              className="transition-all border-b border-gray-700 pb-4 cursor-pointer hover:pl-2" 
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-sm font-semibold text-white">{service.name}</h2>
                                  </div>
                                  <p className="text-gray-400 text-xs mb-2">{service.category}</p>
                                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{service.description}</p>
                                  <span className="text-xs text-gray-500">Preço: Kz {service.price.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Editar">
                                    <Edit2 className="w-4 h-4 text-accent" />
                                  </button>
                                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Deletar">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
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