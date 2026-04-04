'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ReCaptchaV3 } from '@/app/components/common';
import { Button } from '@/app/components/common';
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
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
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
      setRecaptchaToken('');
      onClose();
    }
  });

  const onSubmit = async (data: ServiceFormOutput) => {
    if (!recaptchaToken || !user?.id) return;

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Criar Novo Serviço</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Nome do Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Serviço
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ex: Corte de cabelo"
              className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-accent'
              } focus:ring-2 focus:border-transparent`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (até 500 caracteres)
            </label>
            <textarea
              {...register('description')}
              placeholder="Descreva seu serviço"
              className={`w-full px-4 py-2 border rounded-lg outline-none transition resize-none ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-accent'
              } focus:ring-2 focus:border-transparent`}
              rows={4}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (Kz)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price')}
              placeholder="Digite o preço"
              className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-accent'
              } focus:ring-2 focus:border-transparent`}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Mínimo: 0.01 Kz</p>
          </div>

          {/* ReCaptcha */}
          <div className="flex justify-center pt-2">
            <ReCaptchaV3 onToken={setRecaptchaToken} />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={createService.isPending}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={!recaptchaToken || createService.isPending}
              isLoading={createService.isPending}
              variant="primary"
              size="md"
              className="flex-1"
            >
              Criar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
