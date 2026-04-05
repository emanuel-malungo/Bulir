'use client';

import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		if (isOpen) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.body.style.overflow = 'unset';
			window.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
				onClick={onClose}
			/>
			
			{/* Modal Content */}
			<div className={`relative bg-white rounded-2xl shadow-2xl ${maxWidth} w-full overflow-hidden animate-in zoom-in-95 fade-in duration-300`}>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
					<h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{title}</h3>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6">
					{children}
				</div>
			</div>
		</div>
	);
}
