'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import { Plus, Search, TrendingUp, Edit2, Trash2, Loader2, AlertCircle, X, Wallet, Star, Package, ArrowUpRight }  from "lucide-react";
import CreateServiceModal from '@/components/layout/provider/CreateServiceModal';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useProviderStats } from '@/modules/reservation/useReservation';
import { useUpdateService, useDeleteService, useServices } from '@/modules/service/useService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import iconService from '@/assets/images/service.png';

// Schema para atualizar serviço
const updateServiceSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number().positive('Preço deve ser maior que zero'),
});

type UpdateServiceFormInputs = z.infer<typeof updateServiceSchema>;

export default function ProviderDashboard() {
    const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
    const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    const updateMutation = useUpdateService();
    const deleteMutation = useDeleteService();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<UpdateServiceFormInputs>({
        resolver: zodResolver(updateServiceSchema),
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch stats usando o hook
    const { data: stats, isLoading: isLoadingStats } = useProviderStats({
        enabled: mounted && !!user,
    });

    // Fetch services usando o hook do módulo
    const { data: servicesData, isLoading: isLoadingServices, refetch: refetchServices } = useServices(
        { providerId: user?.id, limit: 100 },
        { enabled: mounted && !!user?.id }
    );

    // Handler para abrir modal de edição
    const handleEditService = (service: any) => {
        setSelectedService(service);
        setValue('name', service.name);
        setValue('description', service.description);
        setValue('price', Number(service.price));
        setIsEditServiceOpen(true);
    };

    // Handler para enviar atualização
    const onSubmitUpdate = async (data: UpdateServiceFormInputs) => {
        if (!selectedService || !user) return;
        try {
            await updateMutation.mutateAsync({
                data: { id: selectedService.id, ...data },
                providerId: user.id,
            });
            setIsEditServiceOpen(false);
            reset();
            setSelectedService(null);
            await refetchServices();
        } catch (error) {
            console.error('Erro ao atualizar:', error);
        }
    };

    // Handler para abrir confirmação de delete
    const handleDeleteService = (service: any) => {
        setSelectedService(service);
        setIsDeleteConfirmOpen(true);
    };

    // Handler para confirmar delete
    const handleConfirmDelete = async () => {
        if (!selectedService || !user) return;
        try {
            await deleteMutation.mutateAsync({
                id: selectedService.id,
                providerId: user.id,
            });
            setIsDeleteConfirmOpen(false);
            setSelectedService(null);
            await refetchServices();
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    };

    if (!mounted || !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    const statsData = stats || { totalReservations: 0, monthlyEarnings: 0 };
    const myServices = servicesData?.data || [];

    return (
        <div className="max-w-7xl mx-auto space-y-10 py-6 animate-in fade-in duration-500">
            <CreateServiceModal isOpen={isCreateServiceOpen} onClose={() => setIsCreateServiceOpen(false)} />
            
            {/* Header com Stats Pro */}
            <header className="grid grid-cols-1 md:grid-cols-3 gap-6" >
                <div className="md:col-span-1 space-y-1">
                </div>

                <div className="md:col-span-1 bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-all cursor-default shadow-sm hover:shadow-md">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none mb-2">Total de Reservas</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-gray-900 italic tracking-tighter">{statsData.totalReservations}</span>
                            <span className="text-[10px] font-black text-green-500 uppercase italic flex items-center gap-0.5">
                                <ArrowUpRight className="w-3 h-3" /> +12%
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-accent group-hover:bg-accent/5 transition-all">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                <div className="md:col-span-1 bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-all cursor-default shadow-sm hover:shadow-md">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none mb-2">Ganhos Mensais</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-[11px] font-black text-accent uppercase italic">Kz</span>
                            <span className="text-3xl font-black text-gray-900 italic tracking-tighter font-mono">
                                {statsData.monthlyEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 border border-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-all">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10" >
                {/* Lado Esquerdo: Call to Action */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-6 shadow-sm group hover:border-accent/20 transition-all relative overflow-hidden" >
                        <div className="w-32 h-32 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-all duration-500">
                             <Image src={iconService} alt="Ícone de serviço" width={80} height={80} className="object-contain" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest italic">Novo Serviço</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic px-4">Expanda o seu portfólio e alcance mais clientes na Bulir</p>
                        </div>
                        <button 
                          onClick={() => setIsCreateServiceOpen(true)}
                          className="w-full bg-accent text-white py-4 px-8 rounded-xl font-black uppercase text-[11px] tracking-[0.25em] italic transition-all flex items-center justify-center gap-3  relative z-10 active:scale-95" 
                        >
                            Confirmar Criação <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-accent/5 border border-accent/10 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white shrink-0 shadow-md shadow-accent/20">
                            <Star className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest italic leading-none mb-1">Dica de Performance</p>
                            <p className="text-[11px] font-bold text-gray-600 tracking-tight">Utilize descrições detalhadas para converter 40% mais reservas.</p>
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Listagem de Serviços */}
                <div className="lg:col-span-7 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[550px]" >
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]" >
                        <div className="space-y-1">
                            <h2 className="text-xs font-black text-white uppercase tracking-[0.25em] italic flex items-center gap-2">
                                <Package className="w-4 h-4 text-accent" />
                                Meus Serviços
                            </h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic opacity-60">Visualização do catálogo activo</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-accent transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="FILTRAR..." 
                                    className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[10px] font-black text-white uppercase tracking-widest placeholder:text-gray-600 outline-none focus:border-accent/50 focus:bg-white/10 transition-all w-32 focus:w-48"
                                />
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        {isLoadingServices ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                            </div>
                        ) : myServices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="p-4 bg-white/5 rounded-full">
                                    <Package className="w-10 h-10 text-gray-700" />
                                </div>
                                <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest italic">Nenhum serviço catalogado</p>
                            </div>
                        ) : myServices.map((service: any) => {
                          return (
                            <div 
                              key={service.id}
                              className="group bg-white/5 border border-white/5 hover:border-accent/30 rounded-xl p-5 transition-all duration-300 relative overflow-hidden" 
                            >
                              <div className="flex items-start justify-between gap-6 relative z-10">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider italic flex-1 truncate">{service.name}</h3>
                                    <span className="text-[9px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full uppercase tracking-widest whitespace-nowrap border border-accent/20">
                                        {service.category || 'Geral'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-400 font-bold leading-relaxed line-clamp-2 italic opacity-80">{service.description}</p>
                                  
                                  <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[10px] font-black text-gray-500 uppercase italic">Kz</span>
                                        <span className="text-sm font-black text-white font-mono tracking-tighter">
                                            {Number(service.price).toLocaleString('pt-AO')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 grayscale opacity-50">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-black text-white italic">4.9</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                  <button 
                                    onClick={() => handleEditService(service)}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="p-2.5 bg-white/5 hover:bg-accent text-gray-400 hover:text-white rounded-lg transition-all border border-white/10" 
                                    title="Ajustar"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteService(service)}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="p-2.5 bg-white/5 hover:bg-red-500 text-gray-400 hover:text-white rounded-lg transition-all border border-white/10" 
                                    title="Remover"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal de Edição */}
            {isEditServiceOpen && selectedService && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 scale-in-center">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-50 p-8">
                            <div className="space-y-1">
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Ajustar Serviço</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Actualize os dados do seu catálogo</p>
                            </div>
                            <button
                                onClick={() => setIsEditServiceOpen(false)}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitUpdate)} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Identificação do Serviço</label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-gray-900"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase italic tracking-widest mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Descrição Detalhada</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-gray-900 resize-none"
                                />
                                {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase italic tracking-widest mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Preço Público (Kz)</label>
                                <input
                                    {...register('price', { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-black font-mono focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-gray-900"
                                />
                                {errors.price && <p className="text-red-500 text-[10px] font-bold uppercase italic tracking-widest mt-1">{errors.price.message}</p>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-[11px] tracking-[0.2em] italic hover:bg-accent transition-all shadow-lg hover:shadow-accent/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Ajustes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Delete */}
            {isDeleteConfirmOpen && selectedService && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-10 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600">
                            <AlertCircle className="w-10 h-10" />
                        </div>

                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest italic mb-2">
                            Remover Serviço?
                        </h2>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed italic mb-8">
                            A remoção de <strong>{selectedService.name}</strong> é irreversível e impedirá novos agendamentos deste item.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="py-4 bg-gray-50 text-gray-400 rounded-xl font-black uppercase text-[10px] tracking-widest italic hover:bg-gray-100 transition-all"
                            >
                                Manter
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleteMutation.isPending}
                                className="py-4 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest italic hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin"/> : 'Remover'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}