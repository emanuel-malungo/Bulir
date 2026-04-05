'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/common';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceFormSchema } from '@/modules/service/service.schema';
import { useCreateService } from '@/modules/service/useService';
import { useAuthStore } from '@/modules/auth/auth.store';
import { z } from 'zod';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tipos para o formulário (input antes do transform e output depois do transform)
type ServiceFormInput = z.input<typeof serviceFormSchema>;
type ServiceFormOutput = z.output<typeof serviceFormSchema>;

export default function CreateServiceModal({ isOpen, onClose }: CreateServiceModalProps) {
  const { user } = useAuthStore();
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ServiceFormInput, any, ServiceFormOutput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
    }
  });

  const createService = useCreateService({
    onSuccess: () => {
      reset();
      onClose();
    }
  });

  const onSubmit = async (data: ServiceFormOutput) => {
    if (!user?.id) return;

    createService.mutate({
      data: {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
      },
      providerId: user.id,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-8">
            <div className="space-y-1">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest italic text-left">Novo Catálogo</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60 text-left">Registe um novo serviço profissional</p>
            </div>
            <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                title="Fechar"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Nome do Serviço */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">
              Nome do Serviço
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ex: Corte de cabelo"
              className={`w-full px-5 py-4 bg-gray-50 border rounded-xl text-sm font-bold outline-none transition focus:bg-white ${
                errors.name ? 'border-red-500 focus:ring-4 focus:ring-red-500/5' : 'border-gray-100 focus:border-accent/30 focus:ring-4 focus:ring-accent/5'
              }`}
            />
            {errors.name && (
              <p className="text-[9px] font-bold text-red-500 uppercase italic tracking-widest mt-1 ml-1">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">
              Descrição Detalhada
            </label>
            <textarea
              {...register('description')}
              placeholder="Descreva o que o cliente pode esperar..."
              className={`w-full px-5 py-4 bg-gray-50 border rounded-xl text-sm font-bold outline-none transition resize-none focus:bg-white ${
                errors.description ? 'border-red-500 focus:ring-4 focus:ring-red-500/5' : 'border-gray-100 focus:border-accent/30 focus:ring-4 focus:ring-accent/5'
              }`}
              rows={4}
            />
            {errors.description && (
              <p className="text-[9px] font-bold text-red-500 uppercase italic tracking-widest mt-1 ml-1">{errors.description.message}</p>
            )}
          </div>

          {/* Preço */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">
              Preço Público (Kz)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price')}
              placeholder="0.00"
              className={`w-full px-5 py-4 bg-gray-50 border rounded-xl text-sm font-black font-mono outline-none transition focus:bg-white ${
                errors.price ? 'border-red-500 focus:ring-4 focus:ring-red-500/5' : 'border-gray-100 focus:border-accent/30 focus:ring-4 focus:ring-accent/5'
              }`}
            />
            {errors.price && (
              <p className="text-[9px] font-bold text-red-500 uppercase italic tracking-widest mt-1 ml-1">{errors.price.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={createService.isPending}
              className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-[11px] tracking-[0.2em] italic hover:bg-accent transition-all shadow-lg hover:shadow-accent/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {createService.isPending ? <Loader2 className="w-4 h-4 animate-spin text-accent" /> : 'Confirmar Criação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
