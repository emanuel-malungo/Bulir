

'use client';

import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implementar lógica de login
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* Gradiente de fundo com cor accent */}
      <div className="absolute inset-0 bg-linear-to-t from-accent/20 via-transparent to-transparent"></div>

      <form  className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h1 className='text-center font-medium text-xl' >Entrar na Bulir</h1>
            <div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mt-4">Email ou nif</label>
              <input type="text" className='w-full border-gray-200'  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-4">Senha</label>
                <input type="password" />
              </div>
            </div>
            <div>
              <div>
                <label className="inline-flex items-center mt-4">
                  <input type="checkbox" className="form-checkbox text-accent" />
                  <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                </label>
              </div>
              <a href="#" className="text-sm text-gray-500 hover:underline">
                Esqueci minha senha
              </a>
            </div>
            <button type="submit" className="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-accent/80 focus:outline-none focus:ring-2">
              Entrar
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Não tem uma conta? </span>
              <a href="/auth/register" className="text-sm text-accent hover:underline">
                Registre-se
              </a>
            </div>
        </div>
      </form>

    
    </div>
  );
}