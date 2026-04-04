'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, AlertCircle, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useService } from '@/modules/service/useService';
import { useCreateReservation } from '@/modules/reservation/useReservation';
import { useAuthStore } from '@/modules/auth/auth.store';

type ReservationFormInputs = {
  date: string;
  time: string;
};

const formSchema = z.object({
  date: z.string().min(1, 'Selecione uma data'),
  time: z.string().min(1, 'Selecione uma hora'),
});

/**
 * Página de agendamento de serviço
 * - Valida autenticação do usuário
 * - Carrega dados do serviço selecionado
 * - Captura data/hora de agendamento
 * - Integra com API para criar reserva
 */
export default function NewReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Parse query params
  const serviceId = searchParams.get('serviceId') ? Number(searchParams.get('serviceId')) : null;
  const providerId = searchParams.get('providerId') ? Number(searchParams.get('providerId')) : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Queries
  const { data: service, isLoading: isLoadingService, error: serviceError } = useService(serviceId, {
    enabled: mounted && !!serviceId && !!user,
  });

  const createReservation = useCreateReservation();

  // Form control
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

  // ===== VALIDATIONS =====
  // Não renderizar até que estejamos montados no cliente
  if (!mounted) {
    return <LoadingState />;
  }

  if (!user) {
    return <NotAuthenticatedState />;
  }

  if (!serviceId || !providerId) {
    return <MissingParamsState serviceId={serviceId} />;
  }

  if (isLoadingService) {
    return <LoadingState />;
  }

  if (serviceError || !service) {
    return <ErrorState error={serviceError} />;
  }

  // ===== HANDLERS =====

  const onSubmit = async (data: ReservationFormInputs) => {
    try {
      setFormError(null);

      // Construir data no timezone local
      const [year, month, day] = data.date.split('-').map(Number);
      const [hours, minutes] = data.time.split(':').map(Number);
      
      const localDate = new Date(year, month - 1, day, hours, minutes);
      
      if (isNaN(localDate.getTime())) {
        setFormError('Data/Hora inválida');
        return;
      }

      // Converter para ISO 8601
      const scheduledAt = localDate.toISOString();

      const payload = {
        serviceId: serviceId!,
        providerId: providerId!,
        scheduledAt,
      };

      console.log('📤 Enviando agendamento:', payload);

      await createReservation.mutateAsync(payload);

      router.push('/client/reservation?success=true');
    } catch (error) {
      console.error('❌ Erro na submissão:', error);
      const message = error instanceof Error ? error.message : 'Erro ao agendar';
      setFormError(message);
    }
  };

  // ===== RENDER =====

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Agendar Serviço</h1>
        <p className="text-gray-600 mt-2">Escolha a data e hora para sua reserva</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Data */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Data*
                  </div>
                </label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      max="2030-12-31"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  )}
                />
                {errors.date && <p className="text-red-600 text-sm mt-2">{errors.date.message}</p>}
                <p className="text-xs text-gray-500 mt-2">Selecione uma data futura</p>
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Hora*
                  </div>
                </label>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="time"
                      min="08:00"
                      max="18:00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  )}
                />
                {errors.time && <p className="text-red-600 text-sm mt-2">{errors.time.message}</p>}
                <p className="text-xs text-gray-500 mt-2">Horário disponível: 08:00 - 18:00</p>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting || createReservation.isPending}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || createReservation.isPending}
                  className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting || createReservation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirmando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirmar Agendamento</span>
                    </>
                  )}
                </button>
              </div>

              {/* Erros */}
              {(createReservation.isError || formError) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-red-700 mt-2 whitespace-pre-wrap">
                      {formError ||
                        (createReservation.error instanceof Error
                          ? createReservation.error.message
                          : 'Tente novamente mais tarde')}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumo da Reserva</h3>

            {/* Serviço */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Serviço</p>
              <h4 className="text-lg font-semibold text-gray-900">{service?.name || '-'}</h4>
              {service?.description && <p className="text-sm text-gray-600 mt-2">{service.description}</p>}
            </div>

            {/* Prestador */}
            {service?.provider && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Prestador</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-accent">{service.provider.fullName?.charAt(0) || '?'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{service.provider.fullName || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{service.provider.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {(selectedDate || selectedTime) && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Agendamento</p>
                <div className="space-y-2">
                  {selectedDate && (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="text-sm">
                        {new Date(`${selectedDate}T00:00`).toLocaleDateString('pt-AO', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="text-sm">{selectedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preço */}
            <div className="bg-accent/10 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Preço Total</p>
              <p className="text-3xl font-bold text-accent">
                Kz {service?.price ? service.price.toLocaleString('pt-BR') : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ===== COMPONENT STATES =====

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );
}

function NotAuthenticatedState() {
  const router = useRouter();
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center flex-col space-y-4">
      <AlertCircle className="w-16 h-16 text-yellow-300" />
      <h2 className="text-xl font-semibold text-gray-900">Você precisa estar autenticado</h2>
      <p className="text-gray-600">Faça login para continuar</p>
      <button
        onClick={() => router.push('/')}
        className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
      >
        Ir para Login
      </button>
    </div>
  );
}

function MissingParamsState({ serviceId }: { serviceId: number | null }) {
  const router = useRouter();
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center flex-col space-y-4">
      <AlertCircle className="w-16 h-16 text-red-300" />
      <h2 className="text-xl font-semibold text-gray-900">Dados do serviço incompletos</h2>
      <p className="text-gray-600 text-center">
        {!serviceId ? 'ID do serviço não foi informado' : 'ID do prestador não foi informado'}
      </p>
      <button
        onClick={() => router.push('/client/services')}
        className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
      >
        Voltar para Serviços
      </button>
    </div>
  );
}

function ErrorState({ error }: { error: Error | null }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center flex-col space-y-4">
      <AlertCircle className="w-16 h-16 text-red-300" />
      <h2 className="text-xl font-semibold text-gray-900">Erro ao carregar serviço</h2>
      <p className="text-gray-600 text-center">
        {error instanceof Error ? error.message : 'Tente novamente mais tarde'}
      </p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Tentar Novamente
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
