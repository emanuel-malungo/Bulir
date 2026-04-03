

'use client';

import { useState } from 'react';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import { Button, Input, ReCaptchaV3, AuthFooter } from '@/app/components/common';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/modules/auth/auth.schema';

export default function Login() {
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      recaptchaToken: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!recaptchaToken) {
      return;
    }

    setIsLoading(true);
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
            <div>
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
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mt-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-accent" />
                  <span className="ml-2 text-xs text-gray-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-xs text-gray-500 hover:underline">
                  Esqueci minha senha
                </a>
              </div>
            </div>
            
            <ReCaptchaV3 onToken={setRecaptchaToken} />
            
            <Button
              type="submit"
              disabled={!recaptchaToken}
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