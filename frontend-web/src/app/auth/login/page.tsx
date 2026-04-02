

'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import ReCaptchaV3 from '@/app/components/common/ReCaptchaV3';

export default function Login() {
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recaptchaToken) {
      setError('Por favor, complete o reCAPTCHA antes de entrar');
      return;
    }

    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          recaptchaToken,
        }),
      });

      if (response.ok) {
        alert('Login realizado com sucesso!');
        // Redirecionar ou fazer algo após sucesso
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro ao conectar com servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* Gradiente de fundo com cor accent */}
      <div className="absolute inset-0 bg-linear-to-t from-accent/20 via-transparent to-transparent"></div>

      <form onSubmit={handleSubmit} className="relative z-10 flex min-h-screen items-center justify-center flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <Image src={icon} alt="Bulir" />
          <span className="text-xl font-medium">Bulir</span>
        </div>
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
            <h1 className='text-center font-medium text-xl' >Entrar na Bulir</h1>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded">
                {error}
              </div>
            )}
            <div>
              <div>
              <label className="block text-sm font-medium text-gray-500 mt-4">Email ou nif</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className='w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50' 
              />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mt-4">Senha</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="sua senha"
                  className='w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50' 
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
            <button 
              type="submit" 
              disabled={isLoading || !recaptchaToken}
              className="w-full bg-accent text-white py-1 px-4 rounded-md hover:bg-accent/80 focus:outline-none focus:ring-2 mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="text-center mt-6 space-y-2">
              <span className="text-xs text-gray-600">ou</span>
              <p className="text-xs text-gray-600 mt-6">Não tem uma conta? <a href="/auth/register" className="text-xs text-accent hover:underline">
                Registre-se
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