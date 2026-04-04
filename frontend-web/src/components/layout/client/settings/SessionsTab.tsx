'use client';

import { useState } from 'react';
import { Smartphone, MapPin, Clock, LogOut, AlertCircle, Monitor } from 'lucide-react';
import { UserAPI } from '@/modules/user/user.services';
import type { ISessionDetail } from '@/modules/user/user.types';

interface SessionsTabProps {
  sessions: ISessionDetail[] | undefined;
  isLoading: boolean;
  userId: number | string | undefined;
  onSessionRevoked?: () => void;
}

export function SessionsTab({ sessions, isLoading, userId, onSessionRevoked }: SessionsTabProps) {
  const [revokeLoading, setRevokeLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRevokeSession = async (sessionId: number) => {
    if (!userId) return;

    setRevokeLoading(sessionId);
    try {
      await UserAPI.revokeSession(userId, sessionId);
      setMessage({ type: 'success', text: 'Sessão encerrada com sucesso!' });
      onSessionRevoked?.();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao encerrar sessão.' });
    } finally {
      setRevokeLoading(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!userId) return;

    setRevokeLoading(-1);
    try {
      await UserAPI.revokeAllSessions(userId);
      setMessage({ type: 'success', text: 'Todas as sessões foram encerradas!' });
      onSessionRevoked?.();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao encerrar sessões.' });
    } finally {
      setRevokeLoading(null);
    }
  };

  const getDeviceIcon = (userAgent?: string | null) => {
    if (!userAgent) return Smartphone;
    if (userAgent.includes('Windows')) return Monitor;
    if (userAgent.includes('Mac')) return Monitor;
    return Smartphone;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!sessions?.length) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Nenhuma sessão ativa encontrada</p>
      </div>
    );
  }

  const activeSessions = sessions.filter((s) => !s.isRevoked);

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {activeSessions.map((session, idx) => {
        const DeviceIcon = getDeviceIcon(session.userAgent);
        const expiresDate = formatDate(session.expiresAt);
        const createdDate = formatDate(session.createdAt);
        const isCurrentSession = idx === 0;

        return (
          <div
            key={session.id}
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <DeviceIcon className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {session.userAgent || 'Dispositivo Desconhecido'}
                    </h3>
                    {isCurrentSession && (
                      <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                        Atual
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{session.ipAddress || 'IP Desconhecido'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Criada em {createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Expira em {expiresDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRevokeSession(session.id)}
                disabled={revokeLoading === session.id || isCurrentSession}
                className="ml-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">{revokeLoading === session.id ? 'Encerrando...' : 'Encerrar'}</span>
              </button>
            </div>
          </div>
        );
      })}

      {activeSessions.length > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleRevokeAllSessions}
            disabled={revokeLoading === -1}
            className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {revokeLoading === -1 ? 'Encerrando todas...' : 'Encerrar Todas as Sessões'}
          </button>
        </div>
      )}
    </div>
  );
}
