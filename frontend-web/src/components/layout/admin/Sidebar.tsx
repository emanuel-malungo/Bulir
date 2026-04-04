
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Wallet, 
  Settings, 
  ShieldCheck,
  X,
  Mail,
  MessageCircle,
  Share2
} from 'lucide-react';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    id: 'users',
    label: 'Usuários',
    icon: Users,
    href: '/admin/users',
  },
  {
    id: 'services',
    label: 'Serviços',
    icon: Briefcase,
    href: '/admin/services',
  },
  {
    id: 'reservations',
    label: 'Reservas',
    icon: Calendar,
    href: '/admin/reservations',
  },
  {
    id: 'finance',
    label: 'Financeiro',
    icon: Wallet,
    href: '/admin/finance',
  },
  {
    id: 'roles',
    label: 'Cargos & Permissões',
    icon: ShieldCheck,
    href: '/admin/roles',
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    href: '/admin/settings',
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed md:sticky top-0 left-0 z-50
        w-64 h-screen bg-gray-900 flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        border-r border-gray-800
      `}>
        <header className="border-b border-gray-800">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-2">
              <Image src={icon} alt="Bulir" width={32} height={32} className="brightness-110" />
              <h1 className="text-xl font-bold text-white tracking-tight">Bulir <span className="text-accent text-xs font-medium px-1.5 py-0.5 bg-accent/10 rounded-md border border-accent/20 ml-1">Admin</span></h1>
            </div>
            {onClose && (
              <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Menu Principal</p>
          </div>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-accent text-white font-semibold shadow-lg shadow-accent/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <IconComponent className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-accent'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        <footer className="border-t border-gray-800 px-6 py-6 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                <ShieldCheck className="w-4 h-4 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">Super Admin</span>
                <span className="text-[10px] text-gray-500 font-medium">Acesso Total</span>
              </div>
            </div>
          </div>
        </footer>
      </aside>
    </>
  );
}
