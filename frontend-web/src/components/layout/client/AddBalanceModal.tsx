'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/common';
import { useLoadBalance } from '@/modules/wallet/useWallet';

/**
 * Schema de validação para adicionar saldo
 */
const addBalanceSchema = z.object({
  amount: z
    .number()
    .positive('Valor deve ser maior que zero')
    .min(100, 'Valor mínimo é Kz 100')
    .max(999999, 'Valor máximo é Kz 999.999'),
});

type AddBalanceFormInputs = z.infer<typeof addBalanceSchema>;

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBalanceModal({ isOpen, onClose }: AddBalanceModalProps) {
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const loadBalance = useLoadBalance();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AddBalanceFormInputs>({
    resolver: zodResolver(addBalanceSchema),
    mode: 'onChange',
    defaultValues: {
      amount: undefined,
    },
  });

  const amount = watch('amount');
  const canSubmit = !!amount;

  const onSubmit = async (data: AddBalanceFormInputs) => {
    try {
      setSuccessMessage('');

      await loadBalance.mutateAsync(data.amount);

      setSuccessMessage(`✅ Saldo de Kz ${data.amount.toLocaleString('pt-BR')} adicionado com sucesso!`);
      
      // Resetar form e fechar modal após sucesso
      setTimeout(() => {
        reset();
        setSuccessMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('❌ Erro ao adicionar saldo:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Adicionar Saldo</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting || loadBalance.isPending}
            className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Mensagem de Sucesso */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Erro da API */}
          {loadBalance.isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 text-sm">
                  Erro ao adicionar saldo
                </p>
                <p className="text-red-700 text-sm mt-1">
                  {loadBalance.error instanceof Error 
                    ? loadBalance.error.message 
                    : 'Tente novamente mais tarde'}
                </p>
              </div>
            </div>
          )}

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor (Kz)*
            </label>
            <input
              {...register('amount', { 
                valueAsNumber: true,
              })}
              type="number"
              min="100"
              step="100"
              placeholder="Digite o valor"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
              disabled={isSubmitting || loadBalance.isPending}
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-2">{errors.amount.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">Mínimo: 100 Kz</p>
          </div>



          {/* Resumo */}
          {amount && (
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Valor a depositar
              </p>
              <p className="text-2xl font-bold text-accent">
                Kz {amount.toLocaleString('pt-BR')}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || loadBalance.isPending}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting || loadBalance.isPending}
              isLoading={isSubmitting || loadBalance.isPending}
              variant="primary"
              size="md"
              className="flex-1"
            >
              {isSubmitting || loadBalance.isPending ? 'Processando...' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
