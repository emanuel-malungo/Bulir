
'use client';
import { useState } from 'react';
import { Search, AlertCircle, Loader, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useServices } from '@/modules/service/useService';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useRouter } from 'next/navigation';
import type { IServiceListItem } from '@/modules/service/service.types';

export default function ClientServices() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);

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

  // Debounce da busca
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectService = (service: IServiceListItem) => {
    router.push(`/client/reservation/new?serviceId=${service.id}&providerId=${service.providerId}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Header */}
      <header className="mb-8 pt-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Descobrir Serviços</h1>
        <p className="text-sm md:text-base text-gray-500">Explore uma ampla variedade de serviços disponíveis perto de você</p>
      </header>

      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar por serviço, provedor ou especialidade..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="w-10 h-10 text-accent animate-spin mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Carregando serviços disponíveis...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          </div>
          <div>
            <h3 className="font-bold text-red-900">Encontramos um erro</h3>
            <p className="text-red-700 text-sm mt-1">
              {error instanceof Error ? error.message : 'Não foi possível carregar os serviços agora.'}
            </p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sem resultados</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Não encontramos nada que corresponda aos seus termos de busca.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-6 text-accent font-bold hover:underline"
          >
            Ver todos os serviços
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 flex flex-col h-full hover:-translate-y-1"
              >
                {/* Header do Card com gradiente sutil */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 border-b border-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors line-clamp-1">{service.name}</h3>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 p-6 flex flex-col">
                  {service.description && (
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{service.description}</p>
                  )}

                  <div className="mt-auto space-y-6">
                    {/* Provedor */}
                    {service.provider && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl group-hover:bg-accent/5 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                          <span className="text-sm font-black text-white">
                            {service.provider.fullName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{service.provider.fullName}</p>
                          <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">Prestador Verificado</p>
                        </div>
                      </div>
                    )}

                    {/* Preço */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Preço do Serviço</p>
                        <p className="text-2xl font-black text-accent tracking-tighter">
                          <span className="text-sm mr-1">Kz</span>
                          {service.price.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleSelectService(service)}
                        className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 group/btn"
                        title="Agendar agora"
                      >
                        <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-8 border-t border-gray-100">
              <div className="text-sm text-gray-500 font-medium order-2 sm:order-1">
                Exibindo{' '}
                <span className="text-gray-900 font-bold">
                  {(pagination.page - 1) * pagination.limit + 1}
                  {'—'}
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                de <span className="text-gray-900 font-bold">{pagination.total}</span> resultados
              </div>

              <div className="flex items-center gap-3 order-1 sm:order-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, idx, arr) => (
                      <div key={page} className="flex items-center gap-2">
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-1 text-gray-300 text-xs font-bold">•••</span>
                        )}
                        <button
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${
                            currentPage === page
                              ? 'bg-accent text-white shadow-lg shadow-accent/20'
                              : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                {/* Mobile Page Indicator */}
                <div className="flex sm:hidden items-center px-4 py-2 bg-gray-50 rounded-xl font-bold text-sm text-gray-600">
                  {currentPage} / {pagination.totalPages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Próxima"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
