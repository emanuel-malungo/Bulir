'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input } from '@/components/common';
import { useEffect } from 'react';

const serviceSchema = z.object({
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	description: z.string().max(500, 'Descrição não pode exceder 500 caracteres').optional().or(z.literal('')),
	price: z.string()
		.transform((val) => parseFloat(val))
		.refine((val) => val > 0, 'Preço deve ser positivo')
		.refine((val) => val >= 10, 'Preço mínimo é 10 Kz'),
	isActive: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface AdminServiceModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ServiceFormData) => void;
	initialData?: any;
	title: string;
	isLoading?: boolean;
}

export default function AdminServiceModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	title,
	isLoading = false,
}: AdminServiceModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<any>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			name: '',
			description: '',
			price: '0',
			isActive: true,
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name || '',
				description: initialData.description || '',
				price: initialData.price?.toString() || '0',
				isActive: initialData.isActive !== undefined ? initialData.isActive : true,
			});
		} else {
			reset({
				name: '',
				description: '',
				price: '0',
				isActive: true,
			});
		}
	}, [initialData, reset, isOpen]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<div className="space-y-4">
					<Input
						label="Nome do Serviço"
						placeholder="Ex: Corte de Cabelo Masculino"
						{...register('name')}
						error={errors.name?.message as string}
						className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-xs font-bold"
					/>

					<div className="space-y-1.5 pt-1">
						<label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
						<textarea
							placeholder="Descreva as características e detalhes deste serviço..."
							{...register('description')}
							rows={3}
							className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none resize-none placeholder:text-gray-400 placeholder:font-medium"
						/>
						{errors.description && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.description.message as string}</p>}
					</div>

					<Input
						label="Preço Base (Kz)"
						type="number"
						placeholder="0"
						{...register('price')}
						error={errors.price?.message as string}
						className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-xs font-bold font-mono"
					/>
				</div>

				<div className="flex items-center gap-3 pt-2">
					<Button
						type="submit"
						isLoading={isLoading}
						className="flex-1 h-11 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 text-[11px] font-bold px-6 tracking-widest uppercase"
					>
						Publicar Serviço
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
