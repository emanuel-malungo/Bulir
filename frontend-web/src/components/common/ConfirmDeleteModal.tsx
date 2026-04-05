'use client';

import { Trash2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	isLoading?: boolean;
}

export default function ConfirmDeleteModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Eliminar permanentemente',
	cancelText = 'Cancelar operação',
	isLoading = false,
}: ConfirmDeleteModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
			<div className="text-center space-y-6">
				<div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100 mb-2">
					<Trash2 className="w-8 h-8 text-red-500" />
				</div>
				
				<div className="space-y-2">
					<h4 className="text-lg font-bold text-gray-900 tracking-tight leading-7">{message}</h4>
					<p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Esta acção não pode ser revertida.</p>
				</div>

				<div className="flex flex-col gap-3 pt-2">
					<Button
						onClick={onConfirm}
						isLoading={isLoading}
						className="h-11 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-100 text-[11px] font-bold px-6 whitespace-nowrap w-full transition-all"
					>
						{confirmText}
					</Button>
					<button
						onClick={onClose}
						disabled={isLoading}
						className="h-11 flex items-center justify-center bg-transparent hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
					>
						{cancelText}
					</button>
				</div>
			</div>
		</Modal>
	);
}
