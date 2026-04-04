"use client";

import { useState } from "react";
import { User, Lock, Smartphone } from "lucide-react";
import { useCurrentUser } from "@/modules/user/useUser";
import { useReservations } from "@/modules/reservation/useReservation";
import { useSessions } from "@/modules/user/useUser";
import { ProfileCard, HistoryTab, SecurityTab, SessionsTab, Tabs } from "@/app/client/components/settings";

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
        { id: 'historico', label: 'Histórico', icon: Smartphone },
        { id: 'seguranca', label: 'Segurança', icon: Lock },
        { id: 'sessoes', label: 'Sessões', icon: Smartphone },
    ];

    return (
        <>
            <header className="grid grid-cols-2 gap-10 mb-8">
                <div>
                    <h1 className="text-2xl font-medium flex items-center space-x-1">
                        <User className="w-6 h-6 text-accent" />
                        <span>Minha Conta</span>
                    </h1>
                    <p className="text-xs text-gray-400">Gerencie suas informações e preferências</p>
                </div>
            </header>

            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as typeof activeTab)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Perfil */}
                    {activeTab === 'perfil' && (
                        <ProfileCard user={user} isLoading={userLoading} />
                    )}

                    {/* Histórico de Reservas */}
                    {activeTab === 'historico' && (
                        <HistoryTab
                            reservations={reservations?.data}
                            isLoading={reservationsLoading}
                        />
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

                {/* Sidebar com informações rápidas */}
                <aside className="lg:col-span-1">
                    <div className="bg-white rounded-lg p-6 sticky top-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Informações Rápidas</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Saldo da Carteira</p>
                                <p className="text-2xl font-bold text-accent">
                                    Kz {user?.balance?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total de Reservas</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {reservations?.data?.length || 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Sessões Ativas</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {sessions?.sessions?.filter(s => !s.isRevoked).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    )
}
