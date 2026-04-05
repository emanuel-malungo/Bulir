'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, TrendingUp, Edit2, Trash2, Loader2, AlertCircle, X, Wallet, Star, Package, ArrowUpRight, Calendar, ArrowRight }  from "lucide-react";
import CreateServiceModal from '@/components/layout/provider/CreateServiceModal';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useProviderStats } from '@/modules/reservation/useReservation';
import { useUpdateService, useDeleteService, useServices } from '@/modules/service/useService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            <CreateServiceModal isOpen={isCreateServiceOpen} onClose={() => setIsCreateServiceOpen(false)} />
            
            {/* Header Sincronizado — Estilo Client */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200 mt-2">
                <div className="space-y-1">
                    <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-2">
                        Gestão Profissional
					</h1>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative group w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-accent transition-all pl-0.5" />
                        <input
                            type="text"
                            placeholder="PESQUISAR NO CATÁLOGO..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] focus:ring-4 focus:ring-accent/5 focus:border-accent/30 transition-all outline-none text-gray-900 font-black placeholder:text-gray-300 placeholder:font-bold tracking-widest"
                        />
                    </div>

                    <button 
                        onClick={() => setIsCreateServiceOpen(true)}
                        className="h-10 flex items-center justify-center bg-gray-900 text-white rounded-xl text-[10px] font-black px-6 whitespace-nowrap w-full sm:w-auto hover:bg-accent transition-all uppercase tracking-[0.2em] italic"
                    >
                        <Plus className="w-3.5 h-3.5 mr-2" /> Novo Serviço
                    </button>
                </div>
            </div>

            {/* Cartões de Visão Geral — Estilo Client Stats (Hibrido Pro) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ganhos — Cartão Light */}
                <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 flex items-center justify-between overflow-hidden">
                    <div className="space-y-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:rotate-6 transition-transform border border-accent/5">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Rendimentos Mensais</p>
                            <h3 className="text-3xl font-black text-gray-900 tabular-nums italic tracking-tighter">
                                {isLoadingStats ? '...' : `Kz ${statsData.monthlyEarnings.toLocaleString()}`}
                            </h3>
                        </div>
                    </div>
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-all">
                        <TrendingUp className="w-10 h-10 text-gray-200 group-hover:text-accent/20 transition-colors" />
                    </div>
                    <div className="absolute top-4 right-4 flex items-center text-[9px] font-black text-green-500 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.5%
                    </div>
                </div>

                {/* Reservas — Cartão Dark */}
                <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 transition-all duration-300 flex items-center justify-between overflow-hidden">
                    <div className="space-y-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/5">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Utilização do Perfil</p>
                            <h3 className="text-3xl font-black text-white tabular-nums italic tracking-tighter">
                                {isLoadingStats ? '...' : statsData.totalReservations} <span className="text-sm not-italic opacity-40 font-bold ml-1 uppercase">Reservas</span>
                            </h3>
                        </div>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-accent group-hover:text-white transition-all cursor-pointer border border-white/5">
                        <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white" />
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-[60px] -mr-12 -mt-12" />
                </div>
            </div>

            {/* Listagem de Serviços — Estrutura de Container Client */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-3">
                        <Package className="w-5 h-5 text-accent" />
                        Catálogo Activo
                    </h2>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                        {myServices.length} Itens Registados
                    </div>
                </div>

                <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white transition-all flex flex-col">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 italic">Serviço / Especialidade</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 italic">Descrição</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 italic">Preço (Kz)</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right italic">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoadingServices ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-accent animate-spin" />
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Sincronizando Catálogo...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : myServices.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <Package className="w-12 h-12 text-gray-300" />
                                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Nenhum serviço catalogado</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    myServices.map((service: any) => (
                                        <tr key={service.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center font-black text-accent text-sm shadow-inner group-hover:scale-110 transition-all italic">
                                                        {service.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-black text-gray-900 leading-tight uppercase group-hover:text-accent transition-colors italic">{service.name}</span>
                                                        <span className="text-[9px] font-bold text-accent bg-accent/5 px-2 py-0.5 rounded-md w-fit uppercase tracking-tighter">
                                                            {service.category || 'Geral'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 max-w-xs">
                                                <p className="text-[11px] text-gray-500 font-bold leading-relaxed italic line-clamp-2">{service.description}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-gray-900 tabular-nums italic tracking-tighter">
                                                    Kz {Number(service.price).toLocaleString('pt-AO')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEditService(service)}
                                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all border border-gray-100" 
                                                        title="Ajustar"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteService(service)}
                                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100" 
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/10">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Frequência de Actualização Semanal</p>
                        <div className="flex items-center gap-1 grayscale opacity-50">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-black text-gray-900 italic">4.9 Avaliação Média</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Edição — Sincronizado */}
            {isEditServiceOpen && selectedService && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-gray-200">
                        <div className="flex items-center justify-between border-b border-gray-200 p-8">
                            <div className="space-y-1 text-left">
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

                        <form onSubmit={handleSubmit(onSubmitUpdate)} className="p-8 space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Identificação do Serviço</label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Descrição Detalhada</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-gray-900 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Preço Público (Kz)</label>
                                <input
                                    {...register('price', { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black font-mono focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-gray-900"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-[11px] tracking-[0.2em] italic hover:bg-accent transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Ajustes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Delete */}
            {isDeleteConfirmOpen && selectedService && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-10 text-center border border-gray-200">
                        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest italic mb-2">Remover Serviço?</h2>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest italic mb-8 px-4">A remoção de <strong>{selectedService.name}</strong> é irreversível.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setIsDeleteConfirmOpen(false)} className="py-4 bg-gray-50 text-gray-400 rounded-xl font-black uppercase text-[10px] tracking-widest italic hover:bg-gray-100 transition-all">Manter</button>
                            <button onClick={handleConfirmDelete} disabled={deleteMutation.isPending} className="py-4 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest italic hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50">
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