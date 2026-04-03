'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ReCaptchaV3 } from '@/app/components/common';
import { Button } from '@/app/components/common';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_CATEGORIES = [
  'Beleza',
  'Limpeza',
  'Educação',
  'Tecnologia',
  'Construção',
  'Saúde',
  'Culinária',
  'Outro',
];

export default function CreateServiceModal({ isOpen, onClose }: CreateServiceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaToken || !name || !category || !price) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Chamar API para criar serviço
      console.log('Criando serviço:', {
        name,
        description,
        category,
        price,
        recaptchaToken,
      });
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Resetar form
      setName('');
      setDescription('');
      setCategory('');
      setPrice('');
      setRecaptchaToken('');
      onClose();
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome do Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Serviço
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Corte de cabelo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
              required
            >
              <option value="">Selecione uma categoria</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (até 200 caracteres)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="Descreva seu serviço"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/200</p>
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço (Kz)
            </label>
            <input
              type="number"
              min="100"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Digite o preço"
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
              disabled={!recaptchaToken || !name || !category || !price}
              isLoading={isLoading}
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
