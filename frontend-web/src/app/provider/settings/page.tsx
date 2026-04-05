"use client";

import { useState, useEffect } from "react";
import { User, Lock, Smartphone, Wallet, CalendarClock, ShieldCheck, Package } from "lucide-react";
import { useCurrentUser, useSessions } from "@/modules/user/useUser";
import { useProviderStats } from "@/modules/reservation/useReservation";
import { useServices } from "@/modules/service/useService";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ProviderProfileCard } from "@/components/layout/provider/settings";
import { SecurityTab, SessionsTab, Tabs } from "@/components/layout/client/settings";

export default function ProviderSettingsPage() {
    const { user: authUser } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca' | 'sessoes'>('perfil');

    useEffect(() => {
        setMounted(true);
    }, []);

    // API hooks
    const { data: user, isLoading: userLoading } = useCurrentUser({
        enabled: mounted && !!authUser
    });
    
    const { data: stats, isLoading: statsLoading } = useProviderStats({
        enabled: mounted && !!authUser
    });

    const { data: servicesData, isLoading: servicesLoading } = useServices(
        { limit: 1, providerId: authUser?.id },
        { enabled: mounted && !!authUser }
    );

    const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useSessions(user?.id ?? null);

    const tabs = [
        { id: 'perfil', label: 'Perfil Profissional', icon: User },
        { id: 'seguranca', label: 'Segurança', icon: Lock },
        { id: 'sessoes', label: 'Acessos Activos', icon: Smartphone },
    ];

    if (!mounted) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header Sincronizado — Estilo Unificado */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200 mt-2 px-2">
                <div className="space-y-1">
                    <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Configurações Base</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Bulir Business Account Control</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id as typeof activeTab)}
                    />

                    <div className="border border-gray-200 rounded-3xl bg-white shadow-none overflow-hidden">
                        {/* Perfil Profissional */}
                        {activeTab === 'perfil' && (
                            <ProviderProfileCard user={user} isLoading={userLoading} />
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

                {/* Sidebar Premium Pro */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-none sticky top-8 overflow-hidden border border-gray-800">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/10 opacity-70 italic flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Painel de Auditoria
                        </h3>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-2 italic">Ganhos Mensais (Kz)</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white italic tracking-tighter tabular-nums">
                                        {stats?.monthlyEarnings?.toLocaleString() || '0,00'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 italic">Serviços</p>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-3.5 h-3.5 text-accent opacity-50" />
                                        <p className="text-xl font-black text-white italic">{servicesData?.meta?.total || 0}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 italic">Pedidos</p>
                                    <div className="flex items-center gap-2">
                                        <CalendarClock className="w-3.5 h-3.5 text-accent opacity-50" />
                                        <p className="text-xl font-black text-white italic">
                                            {stats?.totalReservations || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <ShieldCheck className="w-4 h-4 text-accent" />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Conta Bulir Verificada</span>
                                </div>
                            </div>
                        </div>

                        {/* Abstrat Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[60px] -mr-16 -mt-16" />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col gap-4">
                        <div className="p-3 bg-accent/5 rounded-2xl w-fit">
                            <Wallet className="w-5 h-5 text-accent" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Actualização Automática</p>
                            <p className="text-[11px] font-bold text-gray-700 leading-tight">Os seus rendimentos são liquidados a cada 24 horas úteis.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
