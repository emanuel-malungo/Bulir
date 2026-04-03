'use client';
import { useState, useEffect } from 'react';
import iconEarnings from '@/assets/images/money-bag.png';
import iconService from '@/assets/images/service.png';
import Image from "next/image";
import { Plus, Search, TrendingUp, Edit2, Trash2, Loader2, AlertCircle, X }  from "lucide-react";
import CreateServiceModal from '@/app/components/layout/provider/CreateServiceModal';
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
        <>
            <CreateServiceModal isOpen={isCreateServiceOpen} onClose={() => setIsCreateServiceOpen(false)} />
            <header className="grid grid-cols-2 gap-10 mb-8" >
                <div>
                    <h1 className="text-2xl font-medium flex items-center space-x-1" ><TrendingUp className="w-6 h-6 text-accent " /> <span className="hover:text-accent cursor-pointer" >Total de reservas ({statsData.totalReservations})</span></h1>
                    <p className="text-xs text-gray-400" >Gerencie suas reservas e ganhos</p>
                </div>
                <div className="bg-primary flex items-center justify-between rounded-lg p-4" >
                    <div className="flex items-center space-x-2" >
                        <Image src={iconEarnings} alt="Ícone de ganhos" width={24} height={24} />
                        <span className="text-white font-medium" >Kz {statsData.monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                        {isLoadingServices ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                            </div>
                        ) : myServices.length === 0 ? (
                            <p className="text-gray-400 text-center py-10">Nenhum serviço cadastrado.</p>
                        ) : myServices.map((service: any) => {
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
                                  <span className="text-xs text-gray-500">Preço: Kz {Number(service.price).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <button 
                                    onClick={() => handleEditService(service)}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50" 
                                    title="Editar"
                                  >
                                    <Edit2 className="w-4 h-4 text-accent" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteService(service)}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50" 
                                    title="Deletar"
                                  >
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

            {/* Modal de Edição */}
            {isEditServiceOpen && selectedService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900">Editar Serviço</h2>
                            <button
                                onClick={() => setIsEditServiceOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitUpdate)} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (Kz)</label>
                                <input
                                    {...register('price', { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditServiceOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                                >
                                    {updateMutation.isPending ? 'Atualizando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Delete */}
            {isDeleteConfirmOpen && selectedService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>

                            <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Deletar Serviço?
                            </h2>
                            <p className="text-gray-600 text-sm text-center mb-6">
                                Tem certeza de que deseja deletar <strong>{selectedService.name}</strong>? Esta ação não pode ser desfeita.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}