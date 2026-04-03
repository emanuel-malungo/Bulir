"use client";

import Container from "../../components/layout/Container"
import iconMoney from '@/assets/images/money-bag.png';
import Image from "next/image";
import { User, Lock, Smartphone, LogOut, Eye, EyeOff, Check, X, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function ContaPage() {
    const [activeTab, setActiveTab] = useState<'perfil' | 'historico' | 'seguranca' | 'sessoes'>('perfil');
    const [showPassword, setShowPassword] = useState(false);

    // Mock data
    const profileData = {
        nome: "João Silva",
        email: "joao@example.com",
        telefone: "+244 923 456 789",
        nif: "123456789AB"
    };

    const historico = [
        { id: 1, servico: "Corte de cabelo", data: "03/04/2026", valor: "Kz 2.00", status: "concluído" },
        { id: 2, servico: "Limpeza facial", data: "31/03/2026", valor: "Kz 3.50", status: "concluído" },
        { id: 3, servico: "Massagem", data: "28/03/2026", valor: "Kz 5.00", status: "concluído" },
    ];

    const sessoes = [
        { id: 1, dispositivo: "MacBook Pro", navegador: "Chrome", localizacao: "Luanda", ultimoAcesso: "Agora", ativo: true },
        { id: 2, dispositivo: "iPhone 14", navegador: "Safari", localizacao: "Luanda", ultimoAcesso: "2 horas atrás", ativo: false },
        { id: 3, dispositivo: "Windows PC", navegador: "Chrome", localizacao: "Benguela", ultimoAcesso: "5 dias atrás", ativo: false },
    ];

    const tabs = [
        { id: 'perfil', label: 'Perfil', icon: User },
        { id: 'historico', label: 'Histórico', icon: Clock },
        { id: 'seguranca', label: 'Segurança', icon: Lock },
        { id: 'sessoes', label: 'Sessões', icon: Smartphone },
    ];

    return (
        <Container>
            <header className="grid grid-cols-2 gap-10 mb-8">
                <div>
                    <h1 className="text-2xl font-medium flex items-center space-x-1">
                        <User className="w-6 h-6 text-accent" />
                        <span>Minha Conta</span>
                    </h1>
                    <p className="text-xs text-gray-400">Gerencie suas informações e preferências</p>
                </div>
                <div className="bg-accent flex items-center justify-between rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <Image src={iconMoney} alt="Ícone de dinheiro" width={24} height={24} />
                        <span className="text-white font-medium">Kz 0.00</span>
                    </div>
                    <p className="text-white/80">Saldo atual</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex space-x-1 mb-8 border-b border-gray-200">
                {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center space-x-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                                isActive
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <TabIcon className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Conteúdo das Abas */}
            {/* TAB: PERFIL */}
            {activeTab === 'perfil' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Pessoais</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                                <input 
                                    type="text" 
                                    value={profileData.nome}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    value={profileData.email}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                <input 
                                    type="tel" 
                                    value={profileData.telefone}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">NIF</label>
                                <input 
                                    type="text" 
                                    value={profileData.nif}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                />
                            </div>

                            <button className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: HISTÓRICO */}
            {activeTab === 'historico' && (
                <div className="space-y-4">
                    {historico.length > 0 ? (
                        historico.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{item.servico}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{item.data}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-accent">{item.valor}</p>
                                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full capitalize">
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-600">Nenhum histórico de serviços</p>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: SEGURANÇA */}
            {activeTab === 'seguranca' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Alterar Senha</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Digite sua senha atual"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent pr-10"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                                <input 
                                    type="password"
                                    placeholder="Digite sua nova senha"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirme a Nova Senha</label>
                                <input 
                                    type="password"
                                    placeholder="Confirme sua nova senha"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                />
                            </div>

                            <button className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium">
                                Atualizar Senha
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: SESSÕES */}
            {activeTab === 'sessoes' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-700">
                            Aqui você pode ver todos os dispositivos onde sua conta está ativa. Saia de qualquer sessão que não reconheça.
                        </p>
                    </div>

                    {sessoes.map((sessao) => (
                        <div key={sessao.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <Smartphone className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{sessao.dispositivo}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{sessao.navegador}</p>
                                    </div>
                                </div>
                                {sessao.ativo && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center space-x-1">
                                        <Check className="w-3 h-3" />
                                        <span>Ativo</span>
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200 mb-4">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-sm">{sessao.localizacao}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                                    <span className="text-sm">{sessao.ultimoAcesso}</span>
                                </div>
                            </div>

                            <button className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                                <LogOut className="w-4 h-4" />
                                <span>Sair desta Sessão</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    )
}
