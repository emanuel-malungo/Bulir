
'use client';

import { Users, Briefcase, Calendar, Wallet, TrendingUp, UserCheck, UserX, ArrowUpRight, ArrowDownRight, Activity, Shield } from 'lucide-react';

// Card simplificado para evitar dependência de componentes inexistentes
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>{children}</div>
);

// Mock data para demonstração enquanto não temos a API completa para admin
const stats = [
  { label: 'Total Usuários', value: '1,284', icon: Users, change: '+12%', trend: 'up' },
  { label: 'Provedores Ativos', value: '312', icon: Briefcase, change: '+5%', trend: 'up' },
  { label: 'Serviços Atuais', value: '456', icon: Activity, change: '+8%', trend: 'up' },
  { label: 'Reservas do Mês', value: '892', icon: Calendar, change: '-2%', trend: 'down' },
  { label: 'Faturamento Total', value: 'Kz 45.2M', icon: Wallet, change: '+24%', trend: 'up' },
];

const recentUsers = [
  { name: 'Emanuel Malungo', email: 'emanuel@exemplo.com', role: 'CLIENT', date: '2 horas atrás', status: 'active' },
  { name: 'Maria Silva', email: 'maria@exemplo.com', role: 'PROVIDER', date: '5 horas atrás', status: 'active' },
  { name: 'João Carlos', email: 'joao@exemplo.com', role: 'CLIENT', date: '1 dia atrás', status: 'inactive' },
  { name: 'Ana Paula', email: 'ana@exemplo.com', role: 'PROVIDER', date: '2 dias atrás', status: 'active' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header e Boas-vindas */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview da Plataforma</h1>
        <p className="text-gray-500 font-medium">Bem-vindo ao painel central, aqui você tem o controle total sobre o ecossistema Bulir.</p>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-accent/5 transition-colors">
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                </div>
                {stat.trend === 'up' ? (
                  <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
                    {stat.change} <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                  </span>
                ) : (
                  <span className="flex items-center text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                    {stat.change} <ArrowDownRight className="w-2.5 h-2.5 ml-0.5" />
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-xl font-extrabold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico Placeholder / Resumo Financeiro */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Evolução de Usuários</h2>
              <p className="text-xs text-gray-400 font-medium tracking-tight">Crescimento de novos registros nos últimos 30 dias</p>
            </div>
            <button className="text-xs font-bold text-accent bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 hover:bg-accent/10 transition-colors">Exportar Dados</button>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-50/50">
            {/* Placeholder Visual Simples */}
            <div className="text-center space-y-3 px-6">
              <TrendingUp className="w-12 h-12 text-accent/20 mx-auto" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Visualização de Gráficos <br/> Estará disponível em breve</p>
            </div>
          </div>
        </div>

        {/* Usuários Recentes */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Novos Usuários</h2>
            <p className="text-xs text-gray-400 font-medium tracking-tight">Últimos registros realizados</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                    <div className="flex items-center space-x-1.5 group">
                      <div className="p-0.5 bg-accent/5 rounded-full border border-accent/10 group-hover:bg-accent/10 transition-colors">
                        <Shield className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Segurança Ativa</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{user.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold mb-1">{user.date}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-50 text-center">
            <button className="text-xs font-bold text-gray-500 hover:text-accent transition-colors">Ver todos os usuários</button>
          </div>
        </div>
      </div>
      
      {/* Botões de Ação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-xl flex flex-col justify-between group cursor-pointer hover:bg-black transition-all duration-300">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Validar Provedores</h3>
              <p className="text-sm text-gray-400 font-medium">Você tem 5 provedores pendentes de validação cadastral.</p>
            </div>
          </div>
          <div className="mt-8 flex items-center text-white text-xs font-bold">
            Ir para validações <ArrowUpRight className="w-4 h-4 ml-2" />
          </div>
        </div>
        <div className="bg-accent p-6 rounded-3xl border border-accent/20 shadow-xl flex flex-col justify-between group cursor-pointer hover:brightness-105 transition-all duration-300 shadow-accent/20">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Serviços Destacados</h3>
              <p className="text-sm text-white/80 font-medium">Ajuste as prioridades de exibição na busca principal.</p>
            </div>
          </div>
          <div className="mt-8 flex items-center text-white text-xs font-bold">
            Gerenciar destaque <ArrowUpRight className="w-4 h-4 ml-2" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl flex flex-col justify-between group cursor-pointer hover:border-accent/40 transition-all duration-300">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserX className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Monitorar Fraudes</h3>
              <p className="text-sm text-gray-400 font-medium">Nenhum alerta crítico de segurança detectado nas últimas 24h.</p>
            </div>
          </div>
          <div className="mt-8 flex items-center text-gray-900 text-xs font-bold">
            Relatório de segurança <ArrowUpRight className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
