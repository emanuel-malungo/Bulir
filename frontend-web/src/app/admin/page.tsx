
'use client';

import { useState, useEffect } from 'react';
import {
	Search,
	UserPlus,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import Button from '@/components/common/Button';
import { UserAPI } from '@/modules/user/user.services';
import type { IUserDetail } from '@/modules/user/user.types';

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

	const filteredUsers = users.filter(user =>
		user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.nif?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const activeUsers = users.filter(u => u.isActive).length;
	const totalUsers = users.length;
	const providerUsers = users.filter(u => u.userRoles?.some(r => r.role.name === 'PROVIDER')).length;

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Header com Ações — Minimalista Integrado */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mt-2">
				<div className="space-y-1">
					<h1 className="text-xl font-bold text-gray-900 tracking-tight">Gestão de Utilizadores</h1>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3">
					{/* Search integrado no Header */}
					<div className="relative group w-full sm:w-72">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-all shadow-sm" />
						<input
							type="text"
							placeholder="Pesquisar por nome, email ou NIF..."
							className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[11px] focus:ring-2 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<Button className="h-10 flex items-center bg-primary text-white rounded-lg shadow-sm text-[11px] font-bold px-6 whitespace-nowrap w-full sm:w-auto">
						<UserPlus className="w-3.5 h-3.5 mr-2" /> Adicionar Utilizador
					</Button>
				</div>
			</div>

			{/* Tabela Direta — Ultra Minimalista */}
			<div className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm shadow-gray-50/50">
				<div className="overflow-x-auto">
					<table className="w-full text-left whitespace-nowrap">
						<thead>
							<tr className="bg-gray-50/30">
								<th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Utilizador</th>
								<th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Papel / Nível</th>
								<th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">NIF / Identidade</th>
								<th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
								<th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Cadastro</th>
								<th className="px-6 py-4 border-b border-gray-100 text-right">Acções</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{loading ? (
								<tr><td colSpan={6} className="px-6 py-16 text-center">
									<div className="flex flex-col items-center space-y-3">
										<div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-primary animate-spin"></div>
										<p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic opacity-50">Sincronizando Plataforma...</p>
									</div>
								</td></tr>
							) : filteredUsers.length === 0 ? (
								<tr><td colSpan={6} className="px-6 py-16 text-center text-gray-300 font-bold text-xs uppercase tracking-widest opacity-50 italic">Nenhum utilizador encontrado.</td></tr>
							) : (
								filteredUsers.map((user) => (
									<tr key={user.id} className="hover:bg-gray-50/50 transition-all duration-200 group">
										<td className="px-6 py-4">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-100 flex items-center justify-center font-bold text-gray-400 text-[10px] shadow-sm">
													{user.fullName.charAt(0)}
												</div>
												<div className="flex flex-col">
													<span className="text-sm font-semibold text-gray-900 leading-tight">{user.fullName}</span>
													<span className="text-[10px] text-gray-400 font-medium flex items-center mt-0.5">{user.email}</span>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap gap-1">
												{user.userRoles?.map((ur, idx) => (
													<span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200">
														{ur.role.name}
													</span>
												))}
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="text-[10px] font-mono text-gray-500 font-bold bg-gray-50 px-2.5 py-1 rounded border border-gray-100">{user.nif || '---'}</span>
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex items-center px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${user.isActive
													? 'bg-green-50 text-green-600 border border-green-100'
													: 'bg-red-50 text-red-600 border border-red-100'
												}`}>
												<span className={`w-1 h-1 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
												{user.isActive ? 'Ativo' : 'Inativo'}
											</span>
										</td>
										<td className="px-6 py-4 text-xs text-gray-400 font-bold uppercase tracking-tight">
											{new Date(user.createdAt || Date.now()).toLocaleDateString('pt-AO')}
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-600 hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold transition-all border border-gray-100 shadow-sm hover:shadow-primary/20">
													Actualizar
												</button>
												<button className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-all">
													<UserPlus className="w-3.5 h-3.5" />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Paginação */}
				<div className="p-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
					<p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Sincronizado com o servidor</p>
					<div className="flex items-center space-x-2">
						<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30" disabled>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<div className="flex items-center space-x-1">
							{[1, 2, 3].map((p) => (
								<button key={p} className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${p === 1 ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:bg-white border border-transparent hover:border-gray-200'
									}`}>
									{p}
								</button>
							))}
						</div>
						<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:text-primary transition-all">
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dee2e6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ced4da;
        }
      `}</style>
		</div>
	);
}
