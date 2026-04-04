
'use client';

import { useState, useEffect } from 'react';
import { Clock, LogOut, Menu, Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { AuthService } from '@/modules/auth/auth.services';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user } = useAuthStore();
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
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      router.push('/');
    }
  };

  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((name) => name.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    : 'A';

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 h-full">
        
        {/* Lado Esquerdo */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={onMenuClick}
            className="p-2 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo exibida apenas no Mobile */}
          <div className="flex md:hidden items-center space-x-2">
            <Image src={icon} alt="Bulir" width={28} height={28} />
            <span className="font-bold text-gray-900 text-lg">Bulir Admin</span>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-500 tabular-nums">{time}</span>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-accent/5 rounded-full border border-accent/10">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Modo Administrador</span>
            </div>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Busca Rápida (Desktop) */}
          <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 group focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-32 lg:w-48 placeholder:text-gray-400"
            />
          </div>

          {/* Notificações */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* User & Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex flex-col items-end mr-1">
              <span className="text-sm font-bold text-gray-900 leading-none">{user?.fullName || 'Administrador'}</span>
              <span className="text-[10px] text-gray-500 font-medium">{user?.email || 'admin@bulir.com'}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
              title="Sair"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center shadow-lg border-2 border-white overflow-hidden">
              <span className="text-xs font-bold text-white font-mono">{userInitials}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
