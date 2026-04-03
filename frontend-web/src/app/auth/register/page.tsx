'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import { Button, Input, ReCaptchaV3, AuthFooter, RegisterSidebar } from '@/app/components/common';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerFormSchema, type RegisterFormInput } from '@/modules/auth/auth.schema';
import { AuthService } from '@/modules/auth/auth.services';
import { useAuthStore } from '@/modules/auth/auth.store';
import { AlertCircle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { error: authError } = useAuthStore();
  
  const [recaptchaToken, setRecaptchaTokenState] = useState<string>('');
  
  // Memoizar a função para evitar re-registros desnecessários
  const handleRecaptchaToken = useCallback((token: string) => {
    console.log('🔏 ReCaptcha token recebido:', token ? 'válido' : 'vazio');
    setRecaptchaTokenState(token);
  }, []);
  
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Limpar erro ao montar o componente
  useEffect(() => {
    useAuthStore.getState().setError(null);
    setLocalError(null);
  }, []);

  // Sincronizar erro do store com erro local
  useEffect(() => {
    if (authError) {
      console.log('📨 Erro do store detectado:', authError);
      setLocalError(authError);
    }
  }, [authError]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      nif: '',
      password: '',
      roleId: 1,
    },
  });

  const onSubmit = async (data: RegisterFormInput) => {
    console.log('🔐 Form enviado:', { email: data.email, hasToken: !!recaptchaToken });
    
    if (!recaptchaToken) {
      console.warn('❌ Token do ReCaptcha não encontrado');
      setLocalError('Por favor, complete o reCAPTCHA');
      return;
    }

    setIsLoading(true);
    setLocalError(null);
    useAuthStore.getState().setError(null);

    // Timeout de segurança (5 segundos)
    const timeoutId = setTimeout(() => {
      console.error('⏱️ Timeout: Requisição levou muito tempo');
      setIsLoading(false);
      useAuthStore.getState().setLoading(false);
      setLocalError('Requisição levou muito tempo. Tente novamente.');
    }, 5000);

    try {
      console.log('📤 Enviando registro para API...');
      
      // Chamar o serviço de registro
      await AuthService.register({
        fullName: data.fullName,
        email: data.email,
        nif: data.nif,
        password: data.password,
        roleId: data.roleId,
      });
      
      // Se chegou aqui, registro foi bem-sucedido
      clearTimeout(timeoutId);
      console.log('✅ Registro bem-sucedido');

      // Redirecionar baseado no papel do usuário
      const user = useAuthStore.getState().user;
      if (user?.role) {
        const roleSlug = user.role.toLowerCase();
        console.log(`🔀 Redirecionando para: /${roleSlug}`);
        router.push(`/${roleSlug}`);
      } else {
        console.log('🔀 Redirecionando para: /client');
        router.push('/client');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('❌ Erro capturado:', error);
      
      // O erro já está no store graças ao AuthService
      // Apenas garantir que o estado local está atualizado
      const storeError = useAuthStore.getState().error;
      if (storeError) {
        console.log('📨 Erro do store:', storeError);
        setLocalError(storeError);
      }
    } finally {
      console.log('⏹️ Finalizando submissão');
      setIsLoading(false);
      useAuthStore.getState().setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-linear-to-t from-accent/20 via-transparent to-transparent"></div>

      <div className="relative z-10 flex min-h-screen">
        
        <RegisterSidebar />

        {/* Seção Direita - Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-1/2 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-12 mb-12">
          <div className="w-full max-w-sm">
            
            {/* Logo - Apenas para mobile */}
            <div className="lg:hidden flex items-center space-x-2 mb-8">
              <Image src={icon} alt="Bulir" width={32} height={32} />
              <span className="text-xl font-medium text-gray-900">Bulir</span>
            </div>

            <div className="rounded-lg bg-white p-6 sm:p-8 shadow-md">
              <h1 className="text-center font-semibold text-2xl text-gray-900 mb-6">Criar Conta</h1>
              
              {/* Erro de registro */}
              {(localError) && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{localError}</p>
                </div>
              )}
              
              <div className="space-y-4">
              <div>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Nome Completo"
                      placeholder="seu nome"
                      error={errors.fullName?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>

              <div>
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
                      disabled={isLoading}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="nif"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label="NIF"
                      placeholder="xxxxxxxxxxxxx"
                      error={errors.nif?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      label="Senha"
                      placeholder="sua senha"
                      error={errors.password?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Conta
                      </label>
                      <select
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isLoading}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="1">Cliente</option>
                        <option value="2">Prestador de Serviço</option>
                      </select>
                    </div>
                  )}
                />
              </div>
            </div>
            
            <ReCaptchaV3 onToken={handleRecaptchaToken} />
            
            <Button
              type="submit"
              disabled={!recaptchaToken || isLoading}
              isLoading={isLoading}
              variant="primary"
              size="md"
              className="w-full mt-6"
            >
              Registrar
            </Button>

            <div className="text-center mt-6 space-y-2">
              <span className="text-xs text-gray-600">ou</span>
              <p className="text-xs text-gray-600 mt-4">
                Já tem uma conta? <a href="/auth/login" className="text-accent font-medium hover:underline">
                  Entre aqui
                </a>
              </p>
            </div>
            </div>
          </div>
        </form>

      </div>

      <AuthFooter />
    </div>
  );
}
