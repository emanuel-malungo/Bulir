'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input } from '@/components/common';
import { useEffect } from 'react';

const userSchema = z.object({
	fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	email: z.string().email('Email inválido'),
	nif: z.string().min(9, 'NIF deve ter no mínimo 9 caracteres').max(14, 'NIF máximo 14 caracteres').optional().or(z.literal('')),
	role: z.string().min(1, 'Selecione um papel'),
	isActive: z.boolean().default(true),
});

type UserFormData = {
	fullName: string;
	email: string;
	nif?: string;
	role: string;
	isActive: boolean;
};

interface AdminUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: UserFormData) => void;
	initialData?: Partial<UserFormData>;
	title: string;
	isLoading?: boolean;
}

export default function AdminUserModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	title,
	isLoading = false,
}: AdminUserModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UserFormData>({
		resolver: zodResolver(userSchema) as any,
		defaultValues: {
			fullName: '',
			email: '',
			nif: '',
			role: 'CLIENT',
			isActive: true,
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				fullName: initialData.fullName || '',
				email: initialData.email || '',
				nif: initialData.nif || '',
				role: initialData.role || 'CLIENT',
				isActive: initialData.isActive !== undefined ? initialData.isActive : true,
			});
		} else {
			reset({
				fullName: '',
				email: '',
				nif: '',
				role: 'CLIENT',
				isActive: true,
			});
		}
	}, [initialData, reset, isOpen]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<div className="space-y-4">
					<Input
						label="Nome Completo"
						placeholder="Ex: João Manuel"
						{...register('fullName')}
						error={errors.fullName?.message as string}
						className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-xs font-bold"
					/>

					<Input
						label="Endereço de Email"
						type="email"
						placeholder="exemplo@email.com"
						{...register('email')}
						error={errors.email?.message as string}
						className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-xs font-bold"
					/>

					<div className="grid grid-cols-2 gap-4">
						<Input
							label="NIF / Identidade"
							placeholder="000000000"
							{...register('nif')}
							error={errors.nif?.message as string}
							className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-xs font-bold font-mono"
						/>

						<div className="space-y-1.5">
							<label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Papel / Nível</label>
							<select
								{...register('role')}
								className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none"
							>
								<option value="CLIENT">Cliente</option>
								<option value="PROVIDER">Prestador</option>
								<option value="ADMIN">Administrador</option>
							</select>
							{errors.role && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.role.message}</p>}
						</div>
					</div>

					<div className="flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
						<div className="flex-1">
							<p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Status da Conta</p>
							<p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic leading-tight">Define se o utilizador pode aceder à plataforma.</p>
						</div>
						<div className="relative inline-flex items-center cursor-pointer">
							<input 
								type="checkbox" 
								{...register('isActive')}
								className="sr-only peer" 
							/>
							<div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3 pt-2">
					<Button
						type="submit"
						isLoading={isLoading}
						className="flex-1 h-11 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 text-[11px] font-bold px-6 tracking-widest uppercase"
					>
						Guardar Alterações
					</Button>
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						className="px-6 h-11 text-gray-400 hover:text-gray-900 text-[10px] font-bold uppercase tracking-widest transition-all"
					>
						Cancelar
					</button>
				</div>
			</form>
		</Modal>
	);
}
