'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '@/modules/user/user.schema';
import { UserAPI } from '@/modules/user/user.services';
import { Input, Button } from '@/components/common';
import type { IChangePasswordRequest } from '@/modules/user/user.types';

interface SecurityTabProps {
  userId: number | string | undefined;
}

export function SecurityTab({ userId }: SecurityTabProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: IChangePasswordRequest) => {
    if (!userId) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await UserAPI.changePassword(userId, data);
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      reset();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha. Verifique a senha atual.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lock className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-gray-900">Alterar Senha</h3>
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
          name="currentPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              label="Senha Atual"
              placeholder="Digite sua senha atual"
              error={errors.currentPassword?.message}
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              error={errors.newPassword?.message}
              helperText="Mínimo 8 caracteres, com maiúsculas, minúsculas e números"
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              label="Confirmar Nova Senha"
              placeholder="Confirme sua nova senha"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
            />
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="w-full"
        >
          Alterar Senha
        </Button>
      </form>
    </div>
  );
}
