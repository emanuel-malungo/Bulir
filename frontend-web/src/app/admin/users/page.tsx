
'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  Trash2, 
  UserX, 
  UserCheck, 
  Mail, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { UserAPI } from '@/modules/user/user.services';
import type { IUserDetail } from '@/modules/user/user.types';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function UserManagement() {
  const [users, setUsers] = useState<IUserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserAPI.listUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeUsers = users.filter(u => u.isActive).length;
  const totalUsers = users.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header com Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-accent">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Gestão de Ecossistema</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Utilizadores</h1>
          <p className="text-sm text-gray-500 font-medium">Gerencie perfis, permissões e status de conta de todos os usuários.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-4 border-gray-200">
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
          <Button className="h-11 px-6 shadow-lg shadow-accent/20">
            <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        </div>
      </div>

      {/* Stats Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Registrados', value: totalUsers, sub: 'Todos os tempos', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Contas Ativas', value: activeUsers, sub: `${((activeUsers/totalUsers)*100).toFixed(1)}% do total`, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Provedores', value: users.filter(u => u.userRoles?.some(r => r.role.name === 'PROVIDER')).length, sub: 'Verificados', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Pendentes', value: 0, sub: 'Aguardando validação', icon: UserX, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center space-x-4 shadow-sm">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-lg font-extrabold text-gray-900 leading-none my-1">{stat.value}</h3>
              <p className="text-[10px] text-gray-500 font-medium">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela e Filtros */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Barra de Filtros */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text"
              placeholder="Pesquisar por nome, email ou NIF..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all outline-none text-gray-900 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 text-xs border-gray-200">
              <Filter className="w-3.5 h-3.5 mr-2" /> Filtros Avançados
            </Button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Ações em Massa</p>
          </div>
        </div>

        {/* Tabela de fato */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Utilizador</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Papel / Nível</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">NIF / Identidade</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Data Registro</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                 <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">Carregando dados da plataforma...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">Nenhum utilizador encontrado.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs border border-gray-200 group-hover:bg-accent/10 group-hover:text-accent group-hover:border-accent/20 transition-all">
                          {user.fullName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 leading-tight">{user.fullName}</span>
                          <span className="text-xs text-gray-500 font-medium flex items-center"><Mail className="w-3 h-3 mr-1 opacity-50" /> {user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.userRoles?.map((ur, idx) => (
                           <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
                             {ur.role.name}
                           </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">{user.nif}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.isActive 
                          ? 'bg-green-50 text-green-600 border border-green-100' 
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 font-medium">{new Date().toLocaleDateString('pt-AO')}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium italic">Mostrando 1 a 10 de 1,284 utilizadores totais</p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="w-9 h-9 p-0 border-gray-200">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, '...', 12].map((p, i) => (
                <button key={i} className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  p === 1 ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-gray-500 hover:bg-gray-100'
                }`}>
                  {p}
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-9 h-9 p-0 border-gray-200">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
