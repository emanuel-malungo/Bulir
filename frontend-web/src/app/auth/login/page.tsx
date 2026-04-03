

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import { Button, Input, ReCaptchaV3, AuthFooter } from '@/app/components/common';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/modules/auth/auth.schema';
import { AuthService } from '@/modules/auth/auth.services';
import { useAuthStore } from '@/modules/auth/auth.store';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { error: authError } = useAuthStore();
  const [recaptchaToken, setRecaptchaTokenState] = useState<string>('');
  
  // Memoizar a função para evitar re-registros desnecessários
  const handleRecaptchaToken = useCallback((token: string) => {
    console.log('ReCaptcha token recebido:', token ? 'válido' : 'vazio');
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
      console.log('Erro do store detectado:', authError);
      setLocalError(authError);
    }
  }, [authError]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
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
      console.log('📤 Enviando login para API...');
      
      // Chamar o serviço de login
      await AuthService.login(data.email, data.password);
      
      // Se chegou aqui, login foi bem-sucedido
      clearTimeout(timeoutId);
      console.log('✅ Login bem-sucedido');

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
      
      {/* Gradiente de fundo com cor accent */}
      <div className="absolute inset-0 bg-linear-to-t from-accent/20 via-transparent to-transparent"></div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex min-h-screen items-center justify-center flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <Image src={icon} alt="Bulir" />
          <span className="text-xl font-medium">Bulir</span>
        </div>
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
            <h1 className='text-center font-medium text-xl' >Entrar na Bulir</h1>
            
            {/* Erro de autenticação */}
            {(localError) && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{localError}</p>
              </div>
            )}

            <div className="mt-4">
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
              <div className="mt-4">
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
            </div>
            <div>
              <div className="flex items-center justify-between mt-4">
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-accent" 
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-xs text-gray-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-xs text-gray-500 hover:underline">
                  Esqueci minha senha
                </a>
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
              Entrar
            </Button>

            <div className="text-center mt-6 space-y-2">
              <span className="text-xs text-gray-600">ou</span>
              <p className="text-xs text-gray-600 mt-6">Não tem uma conta? <a href="/auth/register" className="text-xs text-accent hover:underline">
                Registre-se
              </a></p>
            </div>
        </div>
      </form>

      <AuthFooter />

      
    </div>
  );
}