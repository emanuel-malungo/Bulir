
'use client';

import { Bell, Settings, ChevronDown, Menu, Wallet } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useWallet } from '@/modules/wallet/useWallet';

interface HeaderProps {
	onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
	const { user } = useAuthStore();
	const { data: wallet } = useWallet();

	const balance = wallet?.balance ?? 0;

	const userInitials = user?.fullName
		? user.fullName
			.split(' ')
			.map((name: string) => name.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('')
		: 'U';

	return (
		<header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-white border-b border-gray-100 flex items-center px-4 md:px-8 gap-4 md:gap-6 z-40 transition-all duration-300">
			{/* User Profile — Lado Esquerdo */}
			<div className="flex items-center gap-4">
				<button
					onClick={onMenuClick}
					className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
				>
					<Menu className="w-6 h-6" />
				</button>

				<button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
					<div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-sm font-bold shrink-0 shadow-sm border border-accent/5 uppercase">
						{userInitials}
					</div>
					<div className="hidden md:flex flex-col text-left leading-tight">
						<span className="text-sm font-semibold text-gray-700 group-hover:text-accent transition-colors">
							{user?.fullName || 'Usuário Bulir'}
						</span>
						<span className="text-[11px] text-gray-400 font-medium capitalize">
							Cliente
						</span>
					</div>
					<ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors hidden sm:block" />
				</button>
			</div>

			{/* Lado Direito: Saldo + Ações */}
			<div className="flex items-center gap-4 ml-auto">
				{/* Saldo — Destaque Premium */}
				<div className="flex items-center gap-3 px-4 py-2 bg-accent/5 rounded-xl border border-accent/10 group hover:bg-accent/10 transition-all">
					<div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/20">
						<Wallet className="w-4 h-4 text-white" />
					</div>
					<div className="flex flex-col -space-y-0.5">
						<span className="text-sm font-black text-gray-900 tabular-nums">
							Kz {balance.toLocaleString('pt-BR')}
						</span>
					</div>
				</div>

				{/* Divisor */}
				<div className="hidden sm:block w-px h-8 bg-gray-100 mx-1" />

				<div className="flex items-center gap-1 md:gap-2">
					<button className="relative p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-accent transition-all cursor-pointer group">
						<Bell className="w-5 h-5" />
						<span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform" />
					</button>

					<button className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-accent transition-all cursor-pointer">
						<Settings className="w-5 h-5" />
					</button>
				</div>
			</div>
		</header>
	);
}
