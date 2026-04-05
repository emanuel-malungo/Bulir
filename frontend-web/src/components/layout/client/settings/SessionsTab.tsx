'use client';

import { useState } from 'react';
import { Smartphone, MapPin, Clock, LogOut, AlertCircle, Monitor, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
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
      setMessage({ type: 'success', text: 'A sessão seleccionada foi encerrada com sucesso!' });
      onSessionRevoked?.();
    } catch (error) {
      setMessage({ type: 'error', text: 'Não foi possível encerrar a sessão.' });
    } finally {
      setRevokeLoading(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!userId) return;
    setRevokeLoading(-1);
    try {
      await UserAPI.revokeAllSessions(userId);
      setMessage({ type: 'success', text: 'Todas as sessões activas foram terminadas!' });
      onSessionRevoked?.();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro crítico ao tentar encerrar sessões.' });
    } finally {
      setRevokeLoading(null);
    }
  };

  const getDeviceIcon = (userAgent?: string | null) => {
    if (!userAgent) return Smartphone;
    if (userAgent.includes('Windows') || userAgent.includes('Mac')) return Monitor;
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
      <div className="p-10 space-y-6 animate-pulse">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-50 border border-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!sessions?.length) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 py-20">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200">
            <Smartphone className="w-8 h-8" />
        </div>
        <div className="space-y-1">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Sem Actividade Recente</h4>
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic opacity-60">Nenhuma sessão activa encontrada no sistema</p>
        </div>
      </div>
    );
  }

  const activeSessions = sessions.filter((s) => !s.isRevoked);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-50 pb-6">
        <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic leading-none">Controlo de Dispositivos</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Gerencie onde a sua conta está conectada</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent">
            <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 border ${
            message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-widest italic">{message.text}</p>
        </div>
      )}

      <div className="space-y-6">
        {activeSessions.map((session, idx) => {
          const DeviceIcon = getDeviceIcon(session.userAgent);
          const isCurrentSession = idx === 0;

          return (
            <div key={session.id} className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-accent shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <DeviceIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                                {session.userAgent || 'Aparelho Desconhecido'}
                            </h4>
                            {isCurrentSession && (
                                <span className="px-2.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-lg border border-accent/20 italic">
                                    Sessão Atual
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{session.ipAddress || 'IP Oculto'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-2 border-t border-gray-100">
                        <div className="flex flex-col">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic opacity-70">Criado em</p>
                            <span className="text-[10px] font-bold text-gray-600 font-mono italic">{formatDate(session.createdAt)}</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic opacity-70">Expira em</p>
                            <span className="text-[10px] font-bold text-gray-600 font-mono italic">{formatDate(session.expiresAt)}</span>
                        </div>
                    </div>
                  </div>
                </div>

                {!isCurrentSession && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={revokeLoading === session.id}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    title="Terminar Sessão"
                  >
                    {revokeLoading === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeSessions.length > 1 && (
        <div className="pt-8 border-t border-gray-50">
          <button
            onClick={handleRevokeAllSessions}
            disabled={revokeLoading === -1}
            className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 italic"
          >
            {revokeLoading === -1 ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            Revogar Todos os Dispositivos Conectados
          </button>
        </div>
      )}
    </div>
  );
}
