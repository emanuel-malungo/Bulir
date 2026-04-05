'use client';

import { useState } from 'react';
import { Lock, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
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
      setMessage({ type: 'success', text: 'Senha alterada com êxito! Utilize a nova senha no próximo acesso.' });
      reset();
    } catch (error) {
      setMessage({ type: 'error', text: 'Não foi possível alterar a sua senha. Verifique a senha atual.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-50 pb-6">
        <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic leading-none">Proteção de Acesso</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Proteja a sua conta com uma senha robusta</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent">
            <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 border ${
            message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-widest italic">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="space-y-6">
            <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5" /> Senha Atual
                        </label>
                        <input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent/30 focus:bg-white transition-all outline-none text-gray-900"
                            disabled={isLoading}
                        />
                        {errors.currentPassword && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">{errors.currentPassword.message}</p>}
                    </div>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" /> Nova Senha
                            </label>
                            <input
                                {...field}
                                type="password"
                                placeholder="Pelo menos 8 char"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent/30 focus:bg-white transition-all outline-none text-gray-900"
                                disabled={isLoading}
                            />
                            {errors.newPassword && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">{errors.newPassword.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" /> Confirmar Alteração
                            </label>
                            <input
                                {...field}
                                type="password"
                                placeholder="Repita a nova senha"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent/30 focus:bg-white transition-all outline-none text-gray-900"
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">{errors.confirmPassword.message}</p>}
                        </div>
                    )}
                />
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-accent transition-all shadow-lg hover:shadow-accent/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
                <ShieldCheck className="w-4 h-4" /> Actualizar Senha Agora
            </>
          )}
        </button>
      </form>
    </div>
  );
}
