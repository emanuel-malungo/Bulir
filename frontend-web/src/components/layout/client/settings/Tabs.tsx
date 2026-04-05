'use client';

import { LucideIcon } from 'lucide-react';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon: LucideIcon;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex p-1.5 bg-gray-50 border border-gray-100 rounded-2xl w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-accent' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                {tab.label}
            </span>
            {isActive && <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />}
          </button>
        );
      })}
    </div>
  );
}
