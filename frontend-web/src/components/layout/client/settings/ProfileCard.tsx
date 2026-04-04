'use client';

import { useState, useEffect } from 'react';
import { User, Mail, FileText, Edit2, Check, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema } from '@/modules/user/user.schema';
import { useUpdateUser } from '@/modules/user/useUser';
import { Input, Button } from '@/components/common';
import type { IUserDetail, IUpdateUserRequest } from '@/modules/user/user.types';

interface ProfileCardProps {
  user: IUserDetail | undefined;
  isLoading: boolean;
}

export function ProfileCard({ user, isLoading }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const updateMutation = useUpdateUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUpdateUserRequest>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      nif: '',
    },
  });

  // Preencher o formulário com dados do usuário ao entrar em modo edição
  useEffect(() => {
    if (isEditing && user) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        nif: user.nif || '',
      });
    }
  }, [isEditing, user, reset]);

  const onSubmit = async (data: IUpdateUserRequest) => {
    if (!user?.id) return;

    setMessage(null);

    try {
      await updateMutation.mutateAsync({
        userId: user.id,
        data,
      });
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil. Tente novamente.' });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 animate-pulse">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-3/4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Editar Perfil</h3>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Nome Completo"
                placeholder="Seu nome completo"
                error={errors.fullName?.message}
                disabled={updateMutation.isPending}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                label="Email"
                placeholder="seu@email.com"
                error={errors.email?.message}
                disabled={updateMutation.isPending}
              />
            )}
          />

          <Controller
            name="nif"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="NIF"
                placeholder="Seu número de identificação"
                error={errors.nif?.message}
                disabled={updateMutation.isPending}
              />
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={updateMutation.isPending}
              className="flex-1"
            >
              Salvar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => {
                setIsEditing(false);
                reset();
                setMessage(null);
              }}
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  const profileFields = [
    { icon: User, label: 'Nome Completo', value: user?.fullName },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: FileText, label: 'NIF', value: user?.nif },
    { icon: FileText, label: 'Saldo da Carteira', value: `Kz ${user?.balance?.toFixed(2) || '0.00'}` },
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Meu Perfil</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Editar
        </Button>
      </div>

      {profileFields.map((field, idx) => {
        const Icon = field.icon;
        return (
          <div key={idx} className="flex items-start space-x-4">
            <Icon className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{field.label}</p>
              <p className="font-medium text-gray-900">{field.value || '-'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
