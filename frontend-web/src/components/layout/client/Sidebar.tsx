
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import { Search, Calendar, User, Mail, MessageCircle, Share2, Briefcase, X } from 'lucide-react';

const menuItems = [
  {
    id: 'explore',
    label: 'Explorar',
    icon: Search,
    href: '/client',
  },
  {
    id: 'servicos',
    label: 'Serviços',
    icon: Briefcase,
    href: '/client/services',
  },
  {
    id: 'reservas',
    label: 'Reservas',
    icon: Calendar,
    href: '/client/reservation',
  },
  {
    id: 'conta',
    label: 'Minha Conta',
    icon: User,
    href: '/client/settings',
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
        w-64 h-screen bg-gray-100 flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        border-r border-gray-200
      `}>
        <header className="border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-2">
              <Image src={icon} alt="Bulir" width={32} height={32} />
              <h1 className="text-xl font-semibold text-gray-900">Bulir</h1>
            </div>
            {onClose && (
              <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.href === '/client' 
              ? pathname === '/client' 
              : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-white font-semibold shadow-md shadow-accent/20'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-accent'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        <footer className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-center space-x-8">
            <a href="#" className="text-gray-500 hover:text-accent transition-colors" title="Email">
              <Mail className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-accent transition-colors" title="Mensagem">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-accent transition-colors" title="Compartilhar">
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </footer>
      </aside>
    </>
  );
}