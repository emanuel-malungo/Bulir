
'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Star, 
  Settings, 
  Trash2, 
  Eye, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { ServiceAPI } from '@/modules/service/service.services';
import type { IServiceListItem } from '@/modules/service/service.types';
import Button from '@/components/common/Button';

export default function ServiceManagement() {
  const [services, setServices] = useState<IServiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await ServiceAPI.getServices();
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-accent">
            <Briefcase className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Catálogo da Plataforma</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Serviços & Ofertas</h1>
          <p className="text-sm text-gray-500 font-medium">Controle a qualidade, visibilidade e categorias de todos os serviços prestados.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-4 border-gray-200">
            <Filter className="w-4 h-4 mr-2" /> Categorias
          </Button>
          <Button className="h-11 px-6 shadow-lg shadow-accent/20 bg-gray-900 hover:bg-black text-white border-none">
            <TrendingUp className="w-4 h-4 mr-2" /> Analisar Tendências
          </Button>
        </div>
      </div>

      {/* Grid de Cards de Serviços (Exemplo de layout alternativo para Admin) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white h-64 rounded-3xl border border-gray-100 animate-pulse"></div>
          ))
        ) : services.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Nenhum serviço cadastrado no momento.</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Status e Ações Rápidas */}
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                  service.isActive 
                    ? 'bg-green-50 text-green-600 border border-green-100' 
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {service.isActive ? 'Publicado' : 'Suspenso'}
                </span>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-1.5 text-gray-400 hover:text-accent rounded-lg border border-transparent hover:border-accent/10 transition-all"><Eye className="w-4 h-4" /></button>
                   <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg border border-transparent hover:border-red-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                   <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg border border-transparent hover:border-gray-200 transition-all"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors line-clamp-1">{service.name}</h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2 min-h-[32px]">{service.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">4.8</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">(124 Avaliações)</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Preço Estimado</p>
                    <p className="text-sm font-extrabold text-accent">Kz {(service.price || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Rodapé do Card - Info do Provedor */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">P</div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{service.category || 'Categoria'}</span>
                </div>
                <button className="text-[10px] font-bold text-accent hover:underline flex items-center">
                  Ver Provedor <ExternalLink className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginação Estilizada */}
      <div className="flex items-center justify-between bg-white px-8 py-4 rounded-2xl border border-gray-100 italic">
        <p className="text-xs text-gray-500 font-medium">Mostrando {services.length} de {services.length} serviços</p>
        <div className="flex items-center space-x-2 not-italic">
           <button className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"><ChevronLeft className="w-5 h-5" /></button>
           <button className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}
