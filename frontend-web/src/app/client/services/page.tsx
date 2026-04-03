'use client';
import { useState, useMemo } from 'react';
import { Search, AlertCircle, Loader, Plus } from 'lucide-react';
import { useServices } from '@/modules/service/useService';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useRouter } from 'next/navigation';
import type { IServiceListItem } from '@/modules/service/service.types';

export default function ClientServices() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

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
    // Redirecionar para página de agendamento com o serviço pré-selecionado
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
    <>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Descobrir Serviços</h1>
        <p className="text-gray-600">Explore uma ampla variedade de serviços disponíveis</p>
      </header>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por serviço, provedor..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
          <p className="text-gray-600">Carregando serviços...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Erro ao carregar serviços</h3>
            <p className="text-red-700 text-sm mt-1">
              {error instanceof Error ? error.message : 'Tente novamente mais tarde'}
            </p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum serviço encontrado</h3>
          <p className="text-gray-600">Tente ajustar seus filtros ou termos de busca</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Header do Card */}
                <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 p-4">
                  {service.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  )}

                  {/* Provedor */}
                  {service.provider && (
                    <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-accent">
                          {service.provider.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{service.provider.fullName}</p>
                        <p className="text-xs text-gray-500">Prestador de Serviço</p>
                      </div>
                    </div>
                  )}

                  {/* Preço */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Preço</p>
                    <p className="text-2xl font-bold text-accent">Kz {service.price.toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                {/* Footer - Botão */}
                <div className="p-4 pt-0 border-t border-gray-100">
                  <button
                    onClick={() => handleSelectService(service)}
                    className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/90 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agendar Serviço
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Exibindo{' '}
                <span className="font-semibold">
                  {(pagination.page - 1) * pagination.limit + 1}
                  {'-'}
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                de <span className="font-semibold">{pagination.total}</span> serviços
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, idx, arr) => (
                      <div key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-accent text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
