
'use client';

import { useState } from 'react';
import Link from 'next/link';
import icon from '@/assets/images/bulir.svg';
import Image from 'next/image';
import { Search, Calendar, User } from 'lucide-react';

const menuItems = [
  {
    id: 'explore',
    label: 'Explorar',
    icon: Search,
    href: '/client/explore',
  },
  {
    id: 'reservas',
    label: 'Reservas',
    icon: Calendar,
    href: '/client/reservas',
  },
  {
    id: 'conta',
    label: 'Minha Conta',
    icon: User,
    href: '/client/conta',
  },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('explore');

  return (
    <aside className="w-64 h-screen bg-gray-100 flex flex-col sticky top-0">
    <header className="border-b border-gray-200">
        <div className="flex items-center space-x-2 px-4 py-4">
            <Image src={icon} alt="Bulir" width={32} height={32}  />
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
              className={`flex items-center space-x-3  py-3 rounded-lg transition-all duration-200 ${
                activeItem === item.id
                  ? 'text-accent font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
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

        <footer>

        </footer>
    </aside>
  );
}