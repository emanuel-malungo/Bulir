'use client';

import { useState, useEffect } from 'react';
import { User, Mail, FileText, Edit2, Check, X, ShieldAlert, CreditCard, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema } from '@/modules/user/user.schema';
import { useUpdateUser } from '@/modules/user/useUser';
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
      setMessage({ type: 'success', text: 'Os seus dados foram actualizados com êxito!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Não foi possível actualizar o seu perfil. Tente novamente.' });
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 space-y-8 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl" />
            <div className="space-y-2">
                <div className="h-2 w-24 bg-gray-50 rounded" />
                <div className="h-4 w-48 bg-gray-100 rounded" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-50 border border-gray-100 rounded-xl"></div>
            ))}
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-10 space-y-10 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic leading-none">Ajustar Credenciais</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Personalize a sua identidade na plataforma</p>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Nome Completo
                    </label>
                    <input
                        {...field}
                        type="text"
                        placeholder="Ex: Manuel Malungo"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent/30 focus:bg-white transition-all outline-none text-gray-900"
                        disabled={updateMutation.isPending}
                    />
                    {errors.fullName && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">{errors.fullName.message}</p>}
                </div>
                )}
            />

            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> Endereço de Correio
                    </label>
                    <input
                        {...field}
                        type="email"
                        placeholder="exemplo@bulir.com"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent/30 focus:bg-white transition-all outline-none text-gray-900"
                        disabled={updateMutation.isPending}
                    />
                    {errors.email && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">{errors.email.message}</p>}
                </div>
                )}
            />

            <Controller
                name="nif"
                control={control}
                render={({ field }) => (
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> N.I.F (Identificação Fiscal)
                    </label>
                    <input
                        {...field}
                        type="text"
                        placeholder="000000000LA000"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold font-mono focus:ring-4 focus:ring-accent/5 focus:border-accent/30 focus:bg-white transition-all outline-none text-gray-900 placeholder:font-sans"
                        disabled={updateMutation.isPending}
                    />
                    {errors.nif && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">{errors.nif.message}</p>}
                </div>
                )}
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-50">
            <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-accent transition-all shadow-lg hover:shadow-accent/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
               {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
               Confirmar Alterações
            </button>
            <button
                type="button"
                onClick={() => {
                   setIsEditing(false);
                   reset();
                   setMessage(null);
                }}
                disabled={updateMutation.isPending}
                className="px-8 py-4 bg-gray-50 text-gray-500 border border-gray-100 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-gray-100/80 transition-all active:scale-[0.98] disabled:opacity-50"
            >
               Sair sem Salvar
            </button>
          </div>
        </form>
      </div>
    );
  }

  const profileItems = [
    { icon: User, label: 'Nome de Utilizador', value: user?.fullName },
    { icon: Mail, label: 'Endereço Email', value: user?.email },
    { icon: FileText, label: 'Identificação Fiscal', value: user?.nif, isMono: true },
    { icon: CreditCard, label: 'Saldo Atualizado', value: user?.balance?.toLocaleString(), isPrice: true },
  ];

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-50 pb-6">
        <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic leading-none">Meu Perfil</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Visão geral da sua conta particular</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2.5 px-6 py-2.5 bg-accent/5 text-accent border border-accent/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95 group"
        >
          <Edit2 className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
          Actualizar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {profileItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-accent shadow-sm group-hover:scale-110 group-hover:bg-accent/10 group-hover:shadow-accent/5 transition-all duration-300 shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col pt-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1.5 italic opacity-80">{item.label}</p>
                    <div className="flex items-baseline gap-1.5">
                        {item.isPrice && <span className="text-[10px] font-black text-accent uppercase italic">Kz</span>}
                        <span className={`text-sm font-bold text-gray-900 leading-tight transition-colors group-hover:text-accent ${item.isMono || item.isPrice ? 'font-mono tracking-tight' : 'tracking-tight'}`}>
                            {item.value || (idx === 3 ? '0,00' : 'Não Informado')}
                        </span>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
