"use client";

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

            
        </>
    )
}
