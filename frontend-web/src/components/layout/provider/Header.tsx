'use client';

import { useState, useEffect } from 'react';
import { Wallet, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { AuthService } from '@/modules/auth/auth.services';
import { useRouter } from 'next/navigation';
import { useProviderStats } from '@/modules/reservation/useReservation';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: stats } = useProviderStats({
    enabled: mounted && !!user,
  });

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      router.push('/');
    }
  };

  if (!mounted || !user) return null;

  const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';
  const monthlyEarnings = stats?.monthlyEarnings || 0;

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 flex items-center px-10 gap-6">
      
      {/* Lado Esquerdo: Perfil do Prestador */}
      <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black text-sm transition-all ring-4 ring-accent/5 shrink-0 border border-accent/5">
              {userInitial}
          </div>
          <div className="flex flex-col text-left leading-tight">
              <span className="text-sm font-bold text-gray-900 tracking-tight group-hover:text-accent transition-colors">{user.fullName}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">
                  Prestador de Serviço
              </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
      </div>

      {/* Lado Direito: Rendimentos + Notificações */}
      <div className="flex items-center gap-6 ml-auto">
          
          {/* Rendimentos — Foco Financeiro */}
          <div className="flex items-center gap-3 px-4 py-2 bg-accent/5 rounded-xl border border-accent/10 group hover:bg-accent/10 transition-all">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col -space-y-0.5">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic opacity-70">Ganhos do Mês</span>
                  <span className="text-sm font-bold text-gray-900 font-mono tracking-tight tabular-nums">
                      Kz {monthlyEarnings.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
              </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 border-l border-gray-100 pl-6">
              <button className="relative p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-accent transition-all cursor-pointer group">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
              </button>
          </div>
      </div>
    </header>
  );
}
