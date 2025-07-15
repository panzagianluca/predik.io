"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Plus } from "lucide-react";

// Mock data for proposals
const mockProposals = [
  {
    id: 1,
    tipo: "SÍ/NO",
    titulo: "¿Argentina ganará el próximo Mundial?",
    categoria: "Deporte",
    estado: "voting",
    fechaPropuesta: "2025-07-10",
    votos: 45
  },
  {
    id: 2,
    tipo: "Múltiple",
    titulo: "¿Quién será el próximo presidente de Brasil?",
    categoria: "Política",
    estado: "approved",
    fechaPropuesta: "2025-07-08",
    votos: 78
  },
  {
    id: 3,
    tipo: "SÍ/NO",
    titulo: "¿El Bitcoin superará los $100,000 en 2025?",
    categoria: "Economía",
    estado: "rejected",
    fechaPropuesta: "2025-07-05",
    votos: 23
  },
  {
    id: 4,
    tipo: "Múltiple",
    titulo: "¿Qué equipo ganará la Copa Libertadores?",
    categoria: "Deporte",
    estado: "voting",
    fechaPropuesta: "2025-07-12",
    votos: 67
  },
  {
    id: 5,
    tipo: "SÍ/NO",
    titulo: "¿La inflación bajará del 10% este año?",
    categoria: "Economía",
    estado: "approved",
    fechaPropuesta: "2025-07-01",
    votos: 89
  }
];

type ProposalStatus = 'all' | 'voting' | 'approved' | 'rejected';
type SortOption = 'fecha-desc' | 'fecha-asc' | 'votos-desc' | 'votos-asc';

export default function PropuestasPage() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<ProposalStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('fecha-desc');
  const [marketType, setMarketType] = useState<'binary' | 'multiple'>('binary');
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { showToast } = useToast();

  const filteredProposals = mockProposals.filter(proposal => {
    if (filter === 'all') return true;
    return proposal.estado === filter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'fecha-desc':
        return new Date(b.fechaPropuesta).getTime() - new Date(a.fechaPropuesta).getTime();
      case 'fecha-asc':
        return new Date(a.fechaPropuesta).getTime() - new Date(b.fechaPropuesta).getTime();
      case 'votos-desc':
        return b.votos - a.votos;
      case 'votos-asc':
        return a.votos - b.votos;
      default:
        return 0;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Handle form submission
      console.log('New proposal:', {
        marketType,
        title,
        category
      });
      
      // Show success toast
      showToast({
        type: 'success',
        title: '¡Propuesta enviada!',
        message: 'Tu propuesta ha sido enviada exitosamente. La comunidad podrá votar por ella.'
      });
      
      // Reset form and close modal
      setTitle("");
      setCategory("");
      setMarketType('binary');
      setShowModal(false);
    } catch (error) {
      // Show error toast
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Hubo un error al enviar tu propuesta. Por favor, intenta nuevamente.'
      });
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'voting':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">En Votación</span>;
      case 'approved':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Aprobada</span>;
      case 'rejected':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Rechazada</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              💡 Propuestas de Mercados
            </h1>
            <p className="text-muted-foreground">
              Aquí podés ver todas las propuestas de mercados enviadas por la comunidad y votar por tus favoritas.
            </p>
          </div>

          {/* Actions and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Plus size={16} />
              Proponer Mercado
            </Button>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter Buttons - Portfolio Style */}
              <div className="flex rounded-lg border p-1">
                {(['all', 'voting', 'approved', 'rejected'] as const).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      filter === filterType
                        ? 'bg-[rgb(var(--primary))] text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filterType === 'all' ? 'Todas' : 
                     filterType === 'voting' ? 'En Votación' : 
                     filterType === 'approved' ? 'Aprobadas' : 'Rechazadas'}
                  </button>
                ))}
              </div>

              {/* Sort Filter */}
              <div className="flex rounded-lg border p-1">
                {([
                  { key: 'fecha-desc', label: 'Más Recientes' },
                  { key: 'fecha-asc', label: 'Más Antiguas' },
                  { key: 'votos-desc', label: 'Más Votadas' },
                  { key: 'votos-asc', label: 'Menos Votadas' }
                ] as const).map((sortOption) => (
                  <button
                    key={sortOption.key}
                    onClick={() => setSortBy(sortOption.key)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      sortBy === sortOption.key
                        ? 'bg-[rgb(var(--primary))] text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Proposals Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                          {proposal.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {proposal.titulo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{proposal.categoria}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(proposal.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{proposal.votos}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {new Date(proposal.fechaPropuesta).toLocaleDateString('es-AR')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProposals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay propuestas que coincidan con el filtro seleccionado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for New Proposal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 backdrop-blur-sm" 
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Proponer Nuevo Mercado</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Market Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Mercado *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMarketType('binary')}
                      className={`p-3 border-2 rounded-lg text-sm transition-colors ${
                        marketType === 'binary'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      SÍ/NO
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarketType('multiple')}
                      className={`p-3 border-2 rounded-lg text-sm transition-colors ${
                        marketType === 'multiple'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Múltiple
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="modal-title" className="block text-sm font-medium text-gray-700">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="modal-title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ej: ¿Argentina ganará el próximo Mundial?"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="modal-category" className="block text-sm font-medium text-gray-700">
                    Categoría *
                  </label>
                  <select
                    id="modal-category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Política">Política</option>
                    <option value="Deporte">Deporte</option>
                    <option value="Economía">Economía</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Entretenimiento">Entretenimiento</option>
                    <option value="Clima">Clima</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Enviar Propuesta
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
