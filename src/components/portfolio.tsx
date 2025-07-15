"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPosition } from '@/types/user';
import { TrendingUp, TrendingDown, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PortfolioProps {
  userId: string;
}

// Mock portfolio data
const mockPositions: UserPosition[] = [
  {
    id: 'pos1',
    marketId: 1,
    marketTitle: '¿Milei será reelecto en 2027?',
    marketType: 'binary',
    outcome: 'yes',
    outcomeText: 'SÍ',
    shares: 50,
    averagePrice: 0.60,
    currentPrice: 0.65,
    currentValue: 32.50,
    profitLoss: 2.50,
    profitLossPercentage: 8.33,
    purchaseDate: '2024-07-10T10:00:00Z',
    marketEndDate: '2027-10-30',
    marketStatus: 'active'
  },
  {
    id: 'pos2',
    marketId: 2,
    marketTitle: '¿Quién ganará las elecciones presidenciales de 2027?',
    marketType: 'multiple',
    outcome: 'milei',
    outcomeText: 'Javier Milei',
    shares: 25,
    averagePrice: 0.42,
    currentPrice: 0.45,
    currentValue: 11.25,
    profitLoss: 0.75,
    profitLossPercentage: 7.14,
    purchaseDate: '2024-07-08T14:30:00Z',
    marketEndDate: '2027-10-30',
    marketStatus: 'active'
  },
  {
    id: 'pos3',
    marketId: 3,
    marketTitle: '¿El dólar superará los $2000 pesos en 2025?',
    marketType: 'binary',
    outcome: 'no',
    outcomeText: 'NO',
    shares: 75,
    averagePrice: 0.45,
    currentPrice: 0.42,
    currentValue: 31.50,
    profitLoss: -2.25,
    profitLossPercentage: -6.67,
    purchaseDate: '2024-07-05T09:15:00Z',
    marketEndDate: '2025-12-31',
    marketStatus: 'active'
  },
  {
    id: 'pos4',
    marketId: 5,
    marketTitle: '¿La inflación será menor al 50% en 2025?',
    marketType: 'binary',
    outcome: 'yes',
    outcomeText: 'SÍ',
    shares: 100,
    averagePrice: 0.40,
    currentPrice: 0.38,
    currentValue: 38.00,
    profitLoss: -2.00,
    profitLossPercentage: -5.00,
    purchaseDate: '2024-07-01T16:45:00Z',
    marketEndDate: '2025-12-31',
    marketStatus: 'active'
  }
];

export function Portfolio({ userId }: PortfolioProps) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [profitFilter, setProfitFilter] = useState<'all' | 'winning' | 'losing'>('all');

  const totalValue = mockPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalPL = mockPositions.reduce((sum, pos) => sum + pos.profitLoss, 0);
  const totalPLPercentage = totalPL / (totalValue - totalPL) * 100;

  const activePositions = mockPositions.filter(pos => pos.marketStatus === 'active');
  const profitablePositions = mockPositions.filter(pos => pos.profitLoss > 0);

  // Filter positions based on selected filters
  const filteredPositions = mockPositions.filter(position => {
    // Type filter (simulating buy/sell based on profit - this would be actual trade type in real app)
    if (typeFilter === 'buy' && position.profitLoss < 0) return false;
    if (typeFilter === 'sell' && position.profitLoss >= 0) return false;
    
    // Profit filter
    if (profitFilter === 'winning' && position.profitLoss <= 0) return false;
    if (profitFilter === 'losing' && position.profitLoss >= 0) return false;
    
    return true;
  });

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
          <div className={`text-xl font-bold flex items-center ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPL >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
            {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
          </div>
          <div className={`text-xs ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPL >= 0 ? '+' : ''}{totalPLPercentage.toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Posiciones Activas</div>
          <div className="text-xl font-bold">
            {activePositions.length}
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Tasa de Éxito</div>
          <div className="text-xl font-bold">
            {((profitablePositions.length / mockPositions.length) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Posiciones Activas</h3>
          
          <div className="flex items-center space-x-4">
            {/* Type Filter */}
            <div className="flex rounded-lg border p-1">
              {(['all', 'buy', 'sell'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    typeFilter === type
                      ? 'bg-[rgb(var(--primary))] text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {type === 'all' ? 'Todos' : type === 'buy' ? 'Compras' : 'Ventas'}
                </button>
              ))}
            </div>

            {/* Profit Filter */}
            <div className="flex rounded-lg border p-1">
              {(['all', 'winning', 'losing'] as const).map((profit) => (
                <button
                  key={profit}
                  onClick={() => setProfitFilter(profit)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    profitFilter === profit
                      ? 'bg-[rgb(var(--primary))] text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {profit === 'all' ? 'Todas' : profit === 'winning' ? 'Ganadoras' : 'Perdedoras'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mercado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Promedio</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Actual</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Actual</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.map((position) => (
                  <tr key={position.id} className="border-b last:border-b-0 hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <Link 
                          href={`/mercado/${position.marketId}`}
                          className="font-medium hover:text-[rgb(var(--primary))] mb-1 block"
                        >
                          {position.marketTitle}
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {position.marketType === 'binary' ? 'SÍ/NO' : 'Múltiple'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{position.outcomeText}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium">{position.shares}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium">
                        ${(position.averagePrice * 100).toFixed(0)}¢
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium">
                        ${(position.currentPrice * 100).toFixed(0)}¢
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium">
                        ${position.currentValue.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`font-medium flex items-center justify-end ${
                        position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {position.profitLoss >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                        {position.profitLoss >= 0 ? '+' : ''}${position.profitLoss.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`font-medium ${
                        position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {position.profitLossPercentage.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPositions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">
              {mockPositions.length === 0 
                ? "No tienes posiciones activas" 
                : "No hay posiciones que coincidan con los filtros"
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {mockPositions.length === 0 
                ? "Comienza a invertir en mercados de predicción para ver tu portfolio aquí"
                : "Ajusta los filtros para ver otras posiciones"
              }
            </p>
            {mockPositions.length === 0 && (
              <Link href="/">
                <Button>Explorar Mercados</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
