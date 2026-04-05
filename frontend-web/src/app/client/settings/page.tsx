"use client";

import { useState } from "react";
import { User, Lock, Smartphone, Wallet, CalendarClock, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/modules/user/useUser";
import { useReservations } from "@/modules/reservation/useReservation";
import { useSessions } from "@/modules/user/useUser";
import { ProfileCard, SecurityTab, SessionsTab, Tabs } from "@/components/layout/client/settings";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'perfil' | 'historico' | 'seguranca' | 'sessoes'>('perfil');

    // API hooks
    const { data: user, isLoading: userLoading } = useCurrentUser();
    const { data: reservations, isLoading: reservationsLoading } = useReservations({
        limit: 10,
    });
    const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useSessions(user?.id ?? null);

    const tabs = [
        { id: 'perfil', label: 'Perfil', icon: User },
        { id: 'seguranca', label: 'Segurança', icon: Lock },
        { id: 'sessoes', label: 'Sessões', icon: Smartphone },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header com Ações — Estilo Unificado */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mt-2 px-2">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Minha Conta</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Bulir Personal Information Control</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id as typeof activeTab)}
                    />

                    <div className="border border-gray-100 rounded-2xl bg-white shadow-sm shadow-gray-50/50 overflow-hidden">
                        {/* Perfil */}
                        {activeTab === 'perfil' && (
                            <ProfileCard user={user} isLoading={userLoading} />
                        )}

                        {/* Segurança */}
                        {activeTab === 'seguranca' && (
                            <SecurityTab userId={user?.id} />
                        )}

                        {/* Sessões */}
                        {activeTab === 'sessoes' && (
                            <SessionsTab
                                sessions={sessions?.sessions}
                                isLoading={sessionsLoading}
                                userId={user?.id}
                                onSessionRevoked={() => refetchSessions()}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar Premium */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-2xl shadow-black/10 sticky top-8 overflow-hidden">
                        <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/10 opacity-70 italic flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Informações Rápidas
                        </h3>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-2 italic">Saldo Disponível</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-bold text-accent">Kz</span>
                                    <span className="text-3xl font-black text-white italic tracking-tighter tabular-nums">
                                        {user?.balance?.toLocaleString() || '0,00'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Reservas</p>
                                    <p className="text-xl font-black text-white italic">{reservations?.data?.length || 0}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Sessões</p>
                                    <p className="text-xl font-black text-white italic">
                                        {sessions?.sessions?.filter(s => !s.isRevoked).length || 0}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <CalendarClock className="w-4 h-4 text-accent" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Ultimo acesso hoje às {new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Abstrat Decor */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-[80px] opacity-50" />
                    </div>
                </aside>
            </div>
        </div>
    );
}
