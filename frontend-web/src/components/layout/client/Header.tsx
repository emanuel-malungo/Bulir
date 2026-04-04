
'use client';

import { useState, useEffect } from 'react';
import { Clock, LogOut, Wallet, Menu } from 'lucide-react';
import { useWallet } from '@/modules/wallet/useWallet';
import { useAuthStore } from '@/modules/auth/auth.store';
import { AuthService } from '@/modules/auth/auth.services';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: wallet } = useWallet();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
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

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      router.push('/auth/login');
    }
  };

  const balance = wallet?.balance ?? 0;
  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((name) => name.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    : 'U';

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 h-full">
        
        {/* Lado Esquerdo: Mobile Menu e Relógio */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={onMenuClick}
            className="p-2 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400 hidden sm:block" />
            <span className="text-sm font-medium text-gray-500 tabular-nums">{time}</span>
          </div>
        </div>

        {/* Menu do Usuário */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Saldo do Usuário */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
            <div className="p-1 bg-accent/10 rounded-full">
              <Wallet className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
              {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'AOA' })}
            </span>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

          {/* Botão Sair */}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all group"
            title="Sair"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Avatar do Usuário */}
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20 border-2 border-white overflow-hidden">
            <span className="text-xs font-bold text-white">{userInitials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}