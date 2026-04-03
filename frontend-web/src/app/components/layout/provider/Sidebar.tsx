
'use client';

import { useState } from 'react';
import Link from 'next/link';
import icon from '@/assets/images/bulir.svg';
import Image from 'next/image';
import { Briefcase, Calendar, User, Mail, MessageCircle, Share2 } from 'lucide-react';

const menuItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Briefcase,
    href: '/provider/services',
  },
  {
    id: 'reservas',
    label: 'Reservas',
    icon: Calendar,
    href: '/provider/reservations',
  },
  {
    id: 'conta',
    label: 'Minha Conta',
    icon: User,
    href: '/provider/settings',
  },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <aside className="w-56 h-screen bg-gray-100 flex flex-col sticky top-0">
      <header className="border-b border-gray-200">
        <div className="flex items-center space-x-2 px-4 py-4">
          <Image src={icon} alt="Bulir" width={32} height={32} />
          <h1 className="text-center text-xl font-semibold text-gray-900 mt-2">Bulir</h1>
        </div>
      </header>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={`flex items-center space-x-3 py-3 rounded-lg transition-all duration-200 ${
                activeItem === item.id
                  ? 'text-accent font-semibold'
                  : 'text-gray-700 hover:text-accent'
              }`}
            >
              <IconComponent className="w-6 h-6" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <footer className="border-t border-gray-200 px-6 py-4 space-y-3">
        <div className="flex items-center justify-center space-x-8">
          <a
            href="#"
            className="text-gray-500 hover:text-accent transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-accent transition-colors"
            title="Mensagem"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-accent transition-colors"
            title="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </aside>
  );
}