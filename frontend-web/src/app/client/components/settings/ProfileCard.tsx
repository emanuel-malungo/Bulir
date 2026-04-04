'use client';

import { User, Mail, Phone, FileText } from 'lucide-react';
import type { IUserDetail } from '@/modules/user/user.types';

interface ProfileCardProps {
  user: IUserDetail | undefined;
  isLoading: boolean;
}

export function ProfileCard({ user, isLoading }: ProfileCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 animate-pulse">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
          ))}
        </div>
      </div>
    );
  }

  const profileFields = [
    { icon: User, label: 'Nome Completo', value: user?.fullName },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'NIF', value: user?.nif },
    { icon: FileText, label: 'Saldo da Carteira', value: `Kz ${user?.balance?.toFixed(2) || '0.00'}` },
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {profileFields.map((field, idx) => {
        const Icon = field.icon;
        return (
          <div key={idx} className="flex items-start space-x-4">
            <Icon className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{field.label}</p>
              <p className="font-medium text-gray-900">{field.value || '-'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
