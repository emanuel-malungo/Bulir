
'use client';

import { useState } from 'react';
import {
	Briefcase,
	Search,
	Trash2,
	ChevronLeft,
	ChevronRight,
	Star,
	Layers,
	Edit
} from 'lucide-react';
import { useServices, useUpdateService, useDeleteService } from '@/modules/service/useService';
import Button from '@/components/common/Button';
import AdminServiceModal from '../components/AdminServiceModal';
import { ConfirmDeleteModal } from '@/components/common';

export default function ServiceManagement() {
	const [searchTerm, setSearchTerm] = useState('');
	
	// Modal states
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<any>(null);

	// Utilizando o hook useServices do módulo de serviços
	const { data: serviceResponse, isLoading: loading, refetch } = useServices();
	const services = serviceResponse?.data || [];

	const updateService = useUpdateService({
		onSuccess: () => {
			setIsUpdateModalOpen(false);
			setSelectedService(null);
			refetch();
		}
	});

	const deleteService = useDeleteService({
		onSuccess: () => {
			setIsDeleteModalOpen(false);
			setSelectedService(null);
			refetch();
		}
	});

	const filteredServices = services.filter(service =>
		service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		service.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleUpdateSubmit = (data: any) => {
		if (selectedService) {
			updateService.mutate({
				providerId: selectedService.providerId,
				data: {
					id: selectedService.id,
					name: data.name,
					description: data.description,
					price: data.price,
				}
			});
		}
	};

	const handleDeleteConfirm = () => {
		if (selectedService) {
			deleteService.mutate({
				id: selectedService.id,
				providerId: selectedService.providerId
			});
		}
	};

	const openUpdateModal = (service: any) => {
		setSelectedService(service);
		setIsUpdateModalOpen(true);
	};

	const openDeleteModal = (service: any) => {
		setSelectedService(service);
		setIsDeleteModalOpen(true);
	};

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Header com Ações — Estilo Unificado */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mt-2">
				<div className="space-y-1">
					<h1 className="text-xl font-bold text-gray-900 tracking-tight">Catálogo de Serviços</h1>
					<p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Service & Offerings Control</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3">
					<div className="relative group w-full sm:w-72">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-all shadow-sm" />
						<input
							type="text"
							placeholder="Procurar serviço ou categoria..."
							className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] focus:ring-2 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{/* Tabela de Serviços — Minimalista */}
			<div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-50/50">
				<div className="overflow-x-auto">
					<table className="w-full text-left whitespace-nowrap">
						<thead>
							<tr className="bg-gray-50/30">
								<th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">Serviço</th>
								<th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">Preço Base</th>
								<th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
								<th className="px-6 py-4 border-b border-gray-100 text-right">Acções</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{loading ? (
								<tr><td colSpan={4} className="px-6 py-16 text-center">
									<div className="flex flex-col items-center space-y-3">
										<div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-primary animate-spin"></div>
										<p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic opacity-50">Sincronizando Catálogo...</p>
									</div>
								</td></tr>
							) : filteredServices.length === 0 ? (
								<tr><td colSpan={4} className="px-6 py-16 text-center text-gray-300 font-bold text-xs uppercase tracking-widest opacity-50 italic">Nenhum serviço encontrado.</td></tr>
							) : (
								filteredServices.map((service) => (
									<tr key={service.id} className="hover:bg-gray-50/50 transition-all duration-200 group">
										<td className="px-6 py-4">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-100 flex items-center justify-center font-bold text-gray-400 text-[10px] shadow-sm transition-transform group-hover:scale-105 group-hover:bg-primary/5 group-hover:text-primary">
													<Briefcase className="w-4 h-4" />
												</div>
												<div className="flex flex-col">
													<span className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors">{service.name}</span>
													<span className="text-[10px] text-gray-400 font-medium flex items-center mt-0.5 line-clamp-1 max-w-[200px]">{service.description}</span>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="text-[10px] font-mono text-primary font-extrabold bg-primary/5 px-2.5 py-1 rounded border border-primary/10">
												Kz {(service.price || 0).toLocaleString()}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex items-center px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${service.isActive
													? 'bg-green-50 text-green-600 border border-green-100'
													: 'bg-red-50 text-red-600 border border-red-100'
												}`}>
												<span className={`w-1 h-1 rounded-full mr-2 ${service.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
												{service.isActive ? 'Activo' : 'Pendente'}
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button 
													onClick={() => openUpdateModal(service)}
													className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-600 hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold transition-all border border-gray-100 shadow-sm hover:shadow-primary/20"
												>
													<Edit className="w-3.5 h-3.5" /> Actualizar
												</button>
												<button 
													onClick={() => openDeleteModal(service)}
													className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
												>
													<Trash2 className="w-3.5 h-3.5" />
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
					<p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Total de {filteredServices.length} serviços</p>
					<div className="flex items-center space-x-2">
						<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30" disabled>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<div className="flex items-center space-x-1">
							{[1, 2, 3].map((p) => (
								<button key={p} className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${p === 1 ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white border border-transparent hover:border-gray-200'
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

			{/* Modais */}
			<AdminServiceModal 
				isOpen={isUpdateModalOpen}
				onClose={() => setIsUpdateModalOpen(false)}
				onSubmit={handleUpdateSubmit}
				initialData={selectedService}
				title="Actualizar Serviço"
				isLoading={updateService.isPending}
			/>

			<ConfirmDeleteModal 
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteConfirm}
				title="Eliminar Serviço"
				message={`Tem a certeza que deseja eliminar o serviço ${selectedService?.name}?`}
				isLoading={deleteService.isPending}
			/>
		</div>
	);
}
