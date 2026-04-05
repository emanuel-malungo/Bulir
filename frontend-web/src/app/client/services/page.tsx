
'use client';
import { useState } from 'react';
import { Search, AlertCircle, Loader, Plus, ChevronLeft, ChevronRight, Briefcase, CalendarCheck } from 'lucide-react';
import { useServices } from '@/modules/service/useService';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useRouter } from 'next/navigation';
import type { IServiceListItem } from '@/modules/service/service.types';

export default function ClientServices() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Fetch dados da API
  const { data: servicesData, isLoading, error } = useServices(
    {
      page: currentPage,
      limit,
      search: searchTerm || undefined,
      isActive: true,
    },
    { enabled: isAuthenticated() }
  );

  const services: IServiceListItem[] = servicesData?.data || [];
  const pagination = servicesData?.meta || { total: 0, page: 1, limit, totalPages: 1 };

  const handleSelectService = (service: IServiceListItem) => {
    router.push(`/client/reservation/new?serviceId=${service.id}&providerId=${service.providerId}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header com Ações — Estilo Unificado Admin */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mt-2 px-2">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Catálogo de Serviços</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic opacity-60">Explore e reserve serviços disponíveis</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative group w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-accent transition-all shadow-sm" />
            <input
              type="text"
              placeholder="Pesquisar serviço..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] focus:ring-2 focus:ring-accent/5 focus:border-accent/30 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabela de Serviços — Minimalista Style */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-50/50 transition-all hover:shadow-xl hover:shadow-gray-200/20">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Serviço</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 font-mono italic">Prestador</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Preço Base</th>
                <th className="px-8 py-5 border-b border-gray-100 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-accent animate-spin"></div>
                      <p className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">Sincronizando Catálogo...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-red-400 text-[11px] font-bold uppercase tracking-widest italic opacity-60">
                    <div className="flex items-center justify-center gap-2">
                       <AlertCircle className="w-4 h-4" /> Erro ao carregar serviços
                    </div>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-300 font-bold text-[10px] uppercase tracking-widest opacity-50 italic">
                    Nenhum serviço encontrado no catálogo atual.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs shadow-sm group-hover:scale-110 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-accent transition-colors">{service.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium line-clamp-1 max-w-[250px] mt-1 italic">{service.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 group/provider cursor-default">
                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-100 group-hover/provider:bg-accent/10 group-hover/provider:text-accent transition-colors">
                          {service.provider?.fullName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-600 transition-colors group-hover/provider:text-gray-900">{service.provider?.fullName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">
                        <div className="w-1 h-1 rounded-full bg-current mr-2" />
                        Disponível
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-[10px] font-mono text-accent font-extrabold bg-accent/5 px-2.5 py-1 rounded-lg border border-accent/10 shadow-sm">
                        Kz {(service.price || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleSelectService(service)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-accent rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 group/btn"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" /> Agendar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Tabela / Paginação */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-60">Total de {pagination.total} serviços</p>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => (
                  <div key={p} className="flex items-center gap-1">
                     {idx > 0 && arr[idx-1] !== p-1 && <span className="text-[10px] text-gray-300">...</span>}
                     <button 
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                          p === currentPage ? 'bg-accent text-white shadow-sm' : 'text-gray-400 hover:bg-white border border-transparent hover:border-gray-200'
                        }`}
                      >
                       {p}
                     </button>
                  </div>
                ))}
            </div>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === pagination.totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
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
    </div>
  );
}
