'use client';

import { useState } from 'react';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import { Button, Input, ReCaptchaV3, AuthFooter } from '@/app/components/common';
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
      roleId: 1,
    },
  });

  const onSubmit = async (data: RegisterFormInput) => {
    if (!recaptchaToken) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        nif: data.nif,
        password: data.password,
        roleId: data.roleId,
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      });

      if (response.ok) {
        alert('Registro realizado com sucesso!');
        // Redirecionar ou fazer algo após sucesso
      } else {
        const errorData = await response.json();
        console.error('Erro:', errorData);
      }
    } catch (error) {
      console.error('Erro ao conectar com servidor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-linear-to-t from-accent/20 via-transparent to-transparent"></div>

      <div className="relative z-10 flex min-h-screen">
        
        {/* Seção Esquerda - Por que se cadastrar */}
        <div className="hidden lg:flex lg:w-1/2  flex-col items-center p-12">
          <div className="max-w-md text-left space-y-2">
            <div>
              <Image src={icon} alt="Bulir" width={40} height={40} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Por que se cadastrar?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  </div>
                  <span className="text-sm text-gray-700">Encontre profissionais qualificados</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  </div>
                  <span className="text-sm text-gray-700">Gerencie tudo em um único lugar</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  </div>
                  <span className="text-sm text-gray-700">Agendamentos automáticos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  </div>
                  <span className="text-sm text-gray-700">Potencialize com IA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

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
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors duration-200"
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
