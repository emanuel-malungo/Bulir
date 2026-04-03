'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ReCaptchaV3 } from '@/app/components/common';
import { Button, Input } from '@/app/components/common';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBalanceModal({ isOpen, onClose }: AddBalanceModalProps) {
  const [amount, setAmount] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaToken || !amount) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Chamar API para adicionar saldo
      console.log('Adicionando saldo:', {
        amount,
        recaptchaToken,
      });
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Resetar form
      setAmount('');
      setRecaptchaToken('');
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar saldo:', error);
    } finally {
      setIsLoading(false);
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
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor (Kz)
            </label>
            <input
              type="number"
              min="100"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Digite o valor"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo: 100 Kz</p>
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
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={!recaptchaToken || !amount}
              isLoading={isLoading}
              variant="primary"
              size="md"
              className="flex-1"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
