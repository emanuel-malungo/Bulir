

'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';

export default function Login() {
 

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* Gradiente de fundo com cor accent */}
      <div className="absolute inset-0 bg-linear-to-t from-accent/20 via-transparent to-transparent"></div>

      <form  className="relative z-10 flex min-h-screen items-center justify-center flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <Image src={icon} alt="Bulir" />
          <span className="text-xl font-medium">Bulir</span>
        </div>
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
            <h1 className='text-center font-medium text-xl' >Entrar na Bulir</h1>
            <div>
              <div>
              <label className="block text-sm font-medium text-gray-500 mt-4">Email ou nif</label>
              <input type="text" className='w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50' />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mt-4">Senha</label>
                <input type="password" className='w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50' />
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
            <button type="submit" className="w-full bg-accent text-white py-1 px-4 rounded-md hover:bg-accent/80 focus:outline-none focus:ring-2 mt-6 cursor-pointer">
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