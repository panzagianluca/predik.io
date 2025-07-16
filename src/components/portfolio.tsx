"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useUserPositions } from '../hooks/useUserData';

interface PortfolioProps {
  userId: string;
}

export function Portfolio({ userId }: PortfolioProps) {
  const { positions, loading, error, refetch } = useUserPositions();
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');

  const filteredPositions = positions.filter(position => {
    if (filter === 'all') return true;
    if (filter === 'active') return position.market_status === 'active';
    if (filter === 'closed') return position.market_status === 'closed' || position.market_status === 'resolved';
    return true;
  });

  const totalValue = positions.reduce((sum, pos) => sum + pos.current_value, 0);
  const totalInvested = positions.reduce((sum, pos) => sum + pos.total_invested, 0);
  const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealized_pnl, 0);
  const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Cargando portfolio...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-red-600 mb-4">❌ Error cargando portfolio: {error}</p>
          <Button onClick={refetch} variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Valor Total</div>
          <div className="text-xl font-bold">
            ${totalValue.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">P&L Total</div>
          <div className={`text-xl font-bold flex items-center ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </div>
          <div className={`text-xs ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Posiciones Activas</div>
          <div className="text-xl font-bold">
            {positions.filter(p => p.market_status === 'active').length}
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Invertido</div>
          <div className="text-xl font-bold">
            ${totalInvested.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {(['all', 'active', 'closed'] as const).map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterType)}
          >
            {filterType === 'all' ? 'Todas' : filterType === 'active' ? 'Activas' : 'Cerradas'}
          </Button>
        ))}
      </div>

      {/* Positions List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Posiciones</h3>

        {filteredPositions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'all' ? "No tienes posiciones aún" : `No tienes posiciones ${filter === 'active' ? 'activas' : 'cerradas'}`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? "Comienza a invertir en mercados de predicción para ver tu portfolio aquí"
                : "Ajusta los filtros para ver otras posiciones"
              }
            </p>
            {filter === 'all' && (
              <Link href="/">
                <Button>Explorar Mercados</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="border rounded-lg bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mercado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Promedio</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Actual</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPositions.map((position) => (
                    <tr key={position.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-sm">{position.market_title}</div>
                          <div className="text-xs text-muted-foreground">
                            {position.market_type === 'binary' ? 'Binario' : 'Múltiple'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Badge variant={position.position_type === 'yes' ? 'default' : 'secondary'}>
                            {position.option_text || position.position_type.toUpperCase()}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm">
                        {position.shares_owned.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm">
                        ${position.average_price.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm">
                        ${position.current_value.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-mono text-sm ${position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.unrealized_pnl >= 0 ? '+' : ''}${position.unrealized_pnl.toFixed(2)}
                        </div>
                        <div className={`text-xs ${position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.total_invested > 0 ? 
                            `${position.unrealized_pnl >= 0 ? '+' : ''}${((position.unrealized_pnl / position.total_invested) * 100).toFixed(2)}%` 
                            : '0%'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant={position.market_status === 'active' ? 'default' : 'secondary'}>
                          {position.market_status === 'active' ? 'Activo' : 
                           position.market_status === 'closed' ? 'Cerrado' : 
                           position.market_status === 'resolved' ? 'Resuelto' : position.market_status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/mercado/${position.market_id}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
