'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input } from '@/components/common';
import { useEffect } from 'react';
import { useAdminRoles } from '@/modules/auth/useRoles';

const userSchema = z.object({
	fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	email: z.string().email('Email inválido'),
	nif: z.string().min(9, 'NIF deve ter no mínimo 9 caracteres').max(14, 'NIF máximo 14 caracteres').optional().or(z.literal('')),
	role: z.string().min(1, 'Selecione um papel'),
});

type UserFormData = {
	fullName: string;
	email: string;
	nif?: string;
	role: string;
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
	const { roles, isLoading: loadingRoles } = useAdminRoles();
	console.log(roles);

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
			role: '',
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				fullName: initialData.fullName || '',
				email: initialData.email || '',
				nif: initialData.nif || '',
				role: initialData.role || '',
			});
		} else {
			reset({
				fullName: '',
				email: '',
				nif: '',
				role: '',
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
								disabled={loadingRoles}
								className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none disabled:opacity-50"
							>
								<option value="">Seleccione...</option>
								{roles.map((r) => (
									<option key={r.id} value={r.name}>{r.name}</option>
								))}
							</select>
							{errors.role && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.role.message}</p>}
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
