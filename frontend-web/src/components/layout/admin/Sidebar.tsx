
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Users,
	HelpCircle,
	LogOut,
	Box,
	ChevronRight,
	X,
} from "lucide-react";
import icon from "@/assets/images/bulir.svg";
import { AuthService } from "@/modules/auth/auth.services";

const navigation = [
	{
		title: "Menu Principal",
		items: [
			{ label: "Usuários", href: "/admin", icon: Users },
			{ label: "Serviços", href: "/admin/services", icon: Box },
		]
	}
]

interface SidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await AuthService.logout();
			router.push('/');
		} catch (error) {
			console.error('Erro ao fazer logout:', error);
			router.push('/');
		}
	};

	return (
		<>
			{/* Overlay for mobile */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden transition-all duration-300"
					onClick={onClose}
				/>
			)}

			<aside className={`flex flex-col w-72 h-screen bg-white border-r border-gray-200 shrink-0 overflow-hidden fixed lg:sticky top-0 left-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

				{/* Logo Section — Sincronizado com o Header */}
				<div className="flex items-center justify-between px-8 h-20 shrink-0 border-b border-gray-200">
					<div className="flex items-center gap-3">
						<Image src={icon} alt="Bulir" width={32} height={32} className="object-contain" />
						<span className="font-bold text-gray-900 text-xl tracking-tighter">Bulir</span>
					</div>
					{onClose && (
						<button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
							<X className="size-5" />
						</button>
					)}
				</div>

				{/* Navigation — Scrollable Center */}
				<nav className="flex-1 px-4 overflow-y-auto custom-scrollbar flex flex-col gap-6 py-8">
					{navigation.map((section) => {
						const isAnyChildActive = section.items.some(item => pathname === item.href)

						return (
							<div key={section.title} className="flex flex-col gap-3">
								{/* Section Title */}
								<h3 className={`px-4 text-[10px] uppercase tracking-widest font-extrabold ${isAnyChildActive ? 'text-primary' : 'text-gray-400'}`}>
									{section.title}
								</h3>

								{/* Section Items */}
								<div className="flex flex-col gap-1.5">
									{section.items.map(({ label, href, icon: Icon }) => {
										const active = pathname === href
										return (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={onClose}
                                                className={`group relative flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${active 
                                                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                                                    : "text-gray-500 hover:bg-primary/5 hover:text-primary ml-1"}`}
                                            >
                                                <div className="flex items-center gap-3 relative z-10">
                                                    <Icon className={`size-5 shrink-0 transition-all duration-300 ${active ? "text-white rotate-0 scale-110" : "text-gray-400 group-hover:text-primary group-hover:rotate-6"}`} />
                                                    {label}
                                                </div>
                                                {active && (
                                                    <>
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full animate-in slide-in-from-left-2 duration-500" />
                                                        <ChevronRight className="size-4 opacity-70 animate-in slide-in-from-left-2 duration-300 relative z-10" />
                                                    </>
                                                )}
                                            </Link>
										)
									})}
								</div>
							</div>
						)
					})}
				</nav>

				{/* Footer — Fixed at Bottom */}
				<div className="p-4 shrink-0 border-t border-gray-50">
					<div className="bg-gray-50/50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100/50">
						<Link
							href="/admin/ajuda"
							className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-white hover:text-primary transition-all border border-transparent hover:border-gray-100"
						>
							<HelpCircle className="size-4 shrink-0" />
							Central de Ajuda
						</Link>
						<button
							onClick={handleLogout}
							className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer border border-transparent hover:border-red-100"
						>
							<LogOut className="size-4 shrink-0" />
							Terminar Sessão
						</button>
					</div>
				</div>

				<style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #f1f1f1;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #e5e5e5;
            }
            `}</style>
			</aside>
		</>
	)
}
