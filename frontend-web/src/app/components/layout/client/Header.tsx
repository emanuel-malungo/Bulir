
'use client';

import { useState, useEffect } from 'react';
import { Clock, LogOut, Wallet } from 'lucide-react';

export default function Header() {
  const [time, setTime] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    // Define a hora inicial
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // TODO: Buscar saldo real do usuário da API
    setBalance(1250.00);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-56 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between px-6 py-4 h-full">
        
        {/* Relógio do Sistema */}
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">{time}</span>
        </div>

        {/* Menu do Usuário */}
        <div className="flex items-center space-x-4">
          {/* Saldo do Usuário */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
            <Wallet className="w-5 h-5 text-accent" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                Kz {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Botão Sair */}
          <button 
            onClick={() => {
              // TODO: implementar logout
              window.location.href = '/auth/login';
            }}
            className="flex items-center space-x-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>

          {/* Avatar do Usuário */}
          <div className="w-9 h-9 rounded-lg bg-gray-300 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">U</span>
          </div>
        </div>
      </div>
    </header>
  );
}