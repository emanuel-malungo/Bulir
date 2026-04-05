'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, AlertCircle, ArrowLeft, Loader2, CheckCircle, Briefcase, User, Info } from 'lucide-react';
import { useService } from '@/modules/service/useService';
import { useCreateReservation } from '@/modules/reservation/useReservation';
import { useAuthStore } from '@/modules/auth/auth.store';
import Image from 'next/image';

type ReservationFormInputs = {
  date: string;
  time: string;
};

const formSchema = z.object({
  date: z.string().min(1, 'Selecione uma data'),
  time: z.string().min(1, 'Selecione uma hora'),
});

export default function NewReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const serviceId = searchParams.get('serviceId') ? Number(searchParams.get('serviceId')) : null;
  const providerId = searchParams.get('providerId') ? Number(searchParams.get('providerId')) : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: service, isLoading: isLoadingService, error: serviceError } = useService(serviceId, {
    enabled: mounted && !!serviceId && !!user,
  });

  const createReservation = useCreateReservation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ReservationFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: '',
      time: '',
    },
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-12 flex items-center justify-center flex-col space-y-4 max-w-2xl mx-auto mt-10 shadow-sm">
        <AlertCircle className="w-16 h-16 text-yellow-400 opacity-50" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Autenticação Necessária</h2>
        <p className="text-gray-500 text-sm italic">Faça login para continuar com o agendamento</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-8 py-3 bg-accent text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20"
        >
          Ir para Login
        </button>
      </div>
    );
  }

  const onSubmit = async (data: ReservationFormInputs) => {
    try {
      setFormError(null);
      const [year, month, day] = data.date.split('-').map(Number);
      const [hours, minutes] = data.time.split(':').map(Number);
      const localDate = new Date(year, month - 1, day, hours, minutes);
      
      if (isNaN(localDate.getTime())) {
        setFormError('Data/Hora inválida');
        return;
      }

      await createReservation.mutateAsync({
        serviceId: serviceId!,
        providerId: providerId!,
        scheduledAt: localDate.toISOString(),
      });

      router.push('/client/reservation?success=true');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao agendar';
      setFormError(message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header com Ações — Estilo Unificado */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mt-2 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <button 
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
            >
                <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Finalizar Agendamento</h1>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60 ml-10">Confirme os detalhes da sua reserva</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest italic">Horário do Serviço</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Seleccione quando deseja ser atendido</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Data */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Data da Reserva
                  </label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent/30 focus:bg-white transition-all outline-none text-gray-900"
                      />
                    )}
                  />
                  {errors.date && <p className="text-red-500 text-[10px] font-bold uppercase italic tracking-widest">{errors.date.message}</p>}
                </div>

                {/* Hora */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Hora de Início
                  </label>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="time"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent/30 focus:bg-white transition-all outline-none text-gray-900"
                      />
                    )}
                  />
                  {errors.time && <p className="text-red-500 text-[10px] font-bold uppercase italic tracking-widest">{errors.time.message}</p>}
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start gap-4">
                 <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm text-accent">
                    <Info className="w-4 h-4" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Informação Importante</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        Ao confirmar, o valor será cativado do seu saldo. Certifique-se de que o prestador estará disponível no horário selecionado.
                    </p>
                 </div>
              </div>

              {/* Erros e Alertas */}
              {(createReservation.isError || formError) && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest italic">
                    {formError || (createReservation.error instanceof Error ? createReservation.error.message : 'Erro ao processar agendamento')}
                  </p>
                </div>
              )}

              {/* Botão de Acção */}
              <button
                type="submit"
                disabled={isSubmitting || createReservation.isPending}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-accent transition-all shadow-lg hover:shadow-accent/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting || createReservation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Confirmar e Pagar Agora
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar de Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/10 sticky top-8 overflow-hidden">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/10 opacity-70 italic">Resumo da Reserva</h3>

            <div className="space-y-8 relative z-10">
              {/* Serviço */}
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-white shrink-0">
                    <Briefcase className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1 italic">Serviço Seleccionado</p>
                    <h4 className="text-lg font-bold text-white leading-tight tracking-tight">{service?.name || '-'}</h4>
                 </div>
              </div>

              {/* Prestador */}
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-white shrink-0 overflow-hidden">
                    {service?.provider?.fullName.charAt(0) || <User className="w-6 h-6" />}
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1 italic">Prestador Responsável</p>
                    <h4 className="text-lg font-bold text-white leading-tight tracking-tight">{service?.provider?.fullName || '-'}</h4>
                 </div>
              </div>

              {/* Data e Hora Preview */}
              {(selectedDate || selectedTime) && (
                <div className="pt-6 border-t border-white/5 space-y-4">
                     {selectedDate && (
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-accent" />
                            <span className="text-xs font-bold text-gray-300">
                                {new Date(`${selectedDate}T00:00`).toLocaleDateString('pt-AO', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                     )}
                     {selectedTime && (
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-accent" />
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{selectedTime}</span>
                        </div>
                     )}
                </div>
              )}

              {/* Preço Total (Destaque) */}
              <div className="mt-12 pt-8 border-t border-white/10">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 italic">Total a Pagar</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-accent">Kz</span>
                    <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums">
                        {service?.price ? service.price.toLocaleString() : '0'}
                    </span>
                 </div>
              </div>
            </div>

            {/* Abstrat Decor */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-[80px] opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
