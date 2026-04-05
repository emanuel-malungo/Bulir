
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import { 
  Search, 
  Calendar, 
  Briefcase, 
  X, 
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';
import { AuthService } from '@/modules/auth/auth.services';

const navigation = [
  {
    title: "Descobrir",
    items: [
      { id: 'explore', label: 'Explorar Serviços', icon: Search, href: '/client' },
      { id: 'servicos', label: 'Meus Pedidos', icon: Briefcase, href: '/client/services' },
    ]
  },
  {
    title: "Gerenciamento",
    items: [
      { id: 'reservas', label: 'Minhas Reservas', icon: Calendar, href: '/client/reservation' },
      { id: 'conta', label: 'Configurações', icon: Settings, href: '/client/settings' },
    ]
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden transition-all duration-300" 
          onClick={onClose}
        />
      )}
      
      <aside className={`
        flex flex-col w-72 h-screen bg-white border-r border-gray-100 shrink-0 overflow-hidden 
        fixed lg:sticky top-0 left-0 z-50 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between px-8 h-20 shrink-0 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <Image src={icon} alt="Bulir" width={32} height={32} className="object-contain" />
            <span className="font-bold text-gray-900 text-xl tracking-tighter">Bulir</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar flex flex-col gap-8 py-8">
          {navigation.map((section) => {
            const isAnyActive = section.items.some(item => 
              item.href === '/client' ? pathname === '/client' : pathname.startsWith(item.href)
            );

            return (
              <div key={section.title} className="flex flex-col gap-3">
                <h3 className={`px-4 text-[10px] uppercase font-black tracking-[0.2em] ${isAnyActive ? 'text-accent' : 'text-gray-300'}`}>
                  {section.title}
                </h3>

                <div className="flex flex-col gap-1.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === '/client' 
                      ? pathname === '/client' 
                      : pathname.startsWith(item.href);
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className={`group relative flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 ${active 
                          ? "bg-accent text-white " 
                          : "text-gray-500 hover:bg-accent/5 hover:text-accent ml-1"}`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <Icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${active ? "text-white scale-110" : "text-gray-400 group-hover:text-accent group-hover:rotate-3"}`} />
                          {item.label}
                        </div>
                        {active && (
                          <ChevronRight className="w-4 h-4 opacity-70 animate-in slide-in-from-left-2 duration-300 relative z-10" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 shrink-0 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 bg-red-50/50 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #f1f1f1;
            border-radius: 10px;
          }
        `}</style>
      </aside>
    </>
  );
}