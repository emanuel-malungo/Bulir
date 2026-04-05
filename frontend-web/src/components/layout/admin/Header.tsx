
'use client';

import { Bell, Search, Settings, ChevronDown, Menu } from 'lucide-react';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/modules/auth/auth.store';
import { AuthService } from '@/modules/auth/auth.services';
import { useRouter } from 'next/navigation';

interface HeaderProps {
	onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
	const router = useRouter();
	const { user } = useAuthStore();

	const handleLogout = async () => {
		try {
			await AuthService.logout();
			router.push('/');
		} catch (error) {
			console.error('Erro ao fazer logout:', error);
			router.push('/');
		}
	};

	const userInitials = user?.fullName
		? user.fullName
			.split(' ')
			.map((name: string) => name.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('')
		: 'EM';

	return (
		<header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-white border-b border-gray-100 flex items-center px-4 md:px-8 gap-4 md:gap-6 z-40 transition-all duration-300">
			{/* User Profile — Lado Esquerdo */}
			<div className="flex items-center gap-4">
				<button
					onClick={onMenuClick}
					className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
				>
					<Menu className="size-6" />
				</button>

				<button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0 shadow-sm border border-primary/5 uppercase">
						{userInitials}
					</div>
					<div className="hidden md:flex flex-col text-left leading-tight">
						<span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
							{user?.fullName || 'Emanuel Malungo'}
						</span>
						<span className="text-[11px] text-gray-400 font-medium capitalize">
							{user?.role || 'Administrador'}
						</span>
					</div>
					<ChevronDown className="size-4 text-gray-300 group-hover:text-gray-400 transition-colors hidden sm:block" />
				</button>
			</div>

			{/* Lado Direito: Pesquisa + Ações */}
			<div className="flex items-center gap-4 ml-auto">
				{/* Pesquisa */}
				<div className="relative hidden w-48 md:w-64 lg:w-80 sm:block">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-primary" />
					<Input
						type="search"
						placeholder="Pesquisar..."
						className="pl-11 h-11 bg-gray-50/50 border-transparent rounded-2xl text-sm focus-visible:bg-white focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all placeholder:text-gray-400 shadow-sm shadow-transparent focus-within:shadow-gray-200/50"
					/>
				</div>

				{/* Divisor */}
				<div className="hidden sm:block w-px h-8 bg-gray-100 mx-1" />

				<div className="flex items-center gap-1 md:gap-2">
					{/* Notificações */}
					<button className="relative p-2.5 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-primary transition-all cursor-pointer group">
						<Bell className="size-5" />
						<span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform" />
					</button>

					{/* Configurações */}
					<button className="p-2.5 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-primary transition-all cursor-pointer">
						<Settings className="size-5" />
					</button>
				</div>
			</div>
		</header>
	);
}
