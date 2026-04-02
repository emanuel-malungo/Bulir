'use client';

import { useState } from 'react';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import { Button, Input, ReCaptchaV3 } from '@/app/components/common';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerFormSchema, type RegisterFormInput } from '@/modules/auth/auth.schema';

export default function Register() {
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
      confirmPassword: '',
      roleId: 1,
    },
  });

  const onSubmit = async (data: RegisterFormInput) => {
    if (!recaptchaToken) {
      return;
    }

    setIsLoading(true);

 
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* Gradiente de fundo com cor accent */}
      <div className="absolute inset-0 bg-linear-to-t from-accent/20 via-transparent to-transparent"></div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex min-h-screen items-center justify-center flex-col py-8">
        <div className="flex items-center space-x-2 mb-8">
          <Image src={icon} alt="Bulir" />
          <span className="text-xl font-medium">Bulir</span>
        </div>
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
            <h1 className='text-center font-medium text-xl'>Criar Conta na Bulir</h1>
            
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
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      label="Confirmar Senha"
                      placeholder="confirme a senha"
                      error={errors.confirmPassword?.message}
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
                      <label className="block text-sm font-medium text-gray-500">
                        Tipo de Conta
                      </label>
                      <select
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors duration-200"
                      >
                        <option value="1">Cliente</option>
                        <option value="2">Prestador de Serviço</option>
                      </select>
                    </div>
                  )}
                />
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
              Registrar
            </Button>

            <div className="text-center mt-6 space-y-2">
              <span className="text-xs text-gray-600">ou</span>
              <p className="text-xs text-gray-600 mt-6">Já tem uma conta? <a href="/auth/login" className="text-xs text-accent hover:underline">
                Entre aqui
              </a></p>
            </div>
        </div>
      </form>

      <footer className="absolute bottom-0 w-full text-center py-4">
        <p className="text-xs text-gray-500">©2026 Bulir. Todos os direitos reservados. · <a href="#" className="hover:underline">Termos de uso</a> · <a href="#" className="hover:underline">Política de privacidade</a></p>
      </footer>

      
    </div>
  );
}
