"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserTrade } from '@/types/user';
import { ArrowUpIcon, ArrowDownIcon, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';

interface TradeHistoryProps {
  userId: string;
}

// Mock trade history data
const mockTrades: UserTrade[] = [
  {
    id: 'trade1',
    marketId: 1,
    marketTitle: '¿Milei será reelecto en 2027?',
    marketType: 'binary',
    type: 'buy',
    outcome: 'yes',
    outcomeText: 'SÍ',
    shares: 50,
    price: 0.60,
    totalAmount: 30.00,
    timestamp: '2024-07-15T10:30:00Z',
    fees: 0.15
  },
  {
    id: 'trade2',
    marketId: 2,
    marketTitle: '¿Quién ganará las elecciones presidenciales de 2027?',
    marketType: 'multiple',
    type: 'buy',
    outcome: 'milei',
    outcomeText: 'Javier Milei',
    shares: 25,
    price: 0.42,
    totalAmount: 10.50,
    timestamp: '2024-07-14T14:15:00Z',
    fees: 0.05
  },
  {
    id: 'trade3',
    marketId: 3,
    marketTitle: '¿El dólar superará los $2000 pesos en 2025?',
    marketType: 'binary',
    type: 'sell',
    outcome: 'yes',
    outcomeText: 'SÍ',
    shares: 25,
    price: 0.58,
    totalAmount: 14.50,
    timestamp: '2024-07-13T09:45:00Z',
    fees: 0.07
  },
  {
    id: 'trade4',
    marketId: 3,
    marketTitle: '¿El dólar superará los $2000 pesos en 2025?',
    marketType: 'binary',
    type: 'buy',
    outcome: 'no',
    outcomeText: 'NO',
    shares: 75,
    price: 0.45,
    totalAmount: 33.75,
    timestamp: '2024-07-12T16:20:00Z',
    fees: 0.17
  },
  {
    id: 'trade5',
    marketId: 5,
    marketTitle: '¿La inflación será menor al 50% en 2025?',
    marketType: 'binary',
    type: 'buy',
    outcome: 'yes',
    outcomeText: 'SÍ',
    shares: 100,
    price: 0.40,
    totalAmount: 40.00,
    timestamp: '2024-07-10T11:30:00Z',
    fees: 0.20
  },
  {
    id: 'trade6',
    marketId: 4,
    marketTitle: '¿Cuántos goles hará Messi en el Mundial 2026?',
    marketType: 'multiple',
    type: 'buy',
    outcome: '1-2-goles',
    outcomeText: '1-2 goles',
    shares: 40,
    price: 0.25,
    totalAmount: 10.00,
    timestamp: '2024-07-08T13:15:00Z',
    fees: 0.05
  },
  {
    id: 'trade7',
    marketId: 4,
    marketTitle: '¿Cuántos goles hará Messi en el Mundial 2026?',
    marketType: 'multiple',
    type: 'sell',
    outcome: 'no-juega',
    outcomeText: 'No jugará',
    shares: 20,
    price: 0.35,
    totalAmount: 7.00,
    timestamp: '2024-07-05T15:45:00Z',
    fees: 0.04
  }
];

export function TradeHistory({ userId }: TradeHistoryProps) {
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | '90d'>('all');

  const filteredTrades = mockTrades.filter(trade => {
    if (filterType !== 'all' && trade.type !== filterType) return false;
    
    if (dateRange !== 'all') {
      const tradeDate = new Date(trade.timestamp);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - tradeDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case '7d': return daysDiff <= 7;
        case '30d': return daysDiff <= 30;
        case '90d': return daysDiff <= 90;
      }
    }
    
    return true;
  });

  const totalBuyVolume = mockTrades
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  
  const totalSellVolume = mockTrades
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const totalTrades = mockTrades.length;
  const totalShares = mockTrades.reduce((sum, t) => sum + t.shares, 0);

  return (
    <div className="space-y-6">
      {/* Trade Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Trades</div>
          <div className="text-xl font-bold">
            {totalTrades}
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Volumen Compras</div>
          <div className="text-xl font-bold text-green-600">
            ${totalBuyVolume.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Volumen Ventas</div>
          <div className="text-xl font-bold text-red-600">
            ${totalSellVolume.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Acciones</div>
          <div className="text-xl font-bold">
            {totalShares.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
          
          <div className="flex rounded-lg border p-1">
            {(['all', 'buy', 'sell'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  filterType === type
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type === 'all' ? 'Todos' : type === 'buy' ? 'Compras' : 'Ventas'}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border p-1">
            {(['all', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  dateRange === range
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range === 'all' ? 'Todo' : range}
              </button>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Trades List */}
      <div className="space-y-3">
        {filteredTrades.map((trade) => (
          <div key={trade.id} className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
                    trade.type === 'buy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {trade.type === 'buy' ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    )}
                    {trade.type === 'buy' ? 'COMPRA' : 'VENTA'}
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {trade.marketType === 'binary' ? 'SÍ/NO' : 'Múltiple'}
                  </Badge>
                </div>
                
                <Link 
                  href={`/mercado/${trade.marketId}`}
                  className="font-medium hover:text-[rgb(var(--primary))] mb-2 block"
                >
                  {trade.marketTitle}
                </Link>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Resultado</div>
                    <div className="font-medium">{trade.outcomeText}</div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Cantidad</div>
                    <div className="font-medium">{trade.shares} acciones</div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Precio</div>
                    <div className="font-medium">
                      {(trade.price * 100).toFixed(0)}%
                      <div className="text-xs text-muted-foreground">
                        ${(trade.price * 100).toFixed(0)}¢
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Total</div>
                    <div className="font-medium">
                      ${trade.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-sm text-muted-foreground">
                  {new Date(trade.timestamp).toLocaleDateString('es-AR')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(trade.timestamp).toLocaleTimeString('es-AR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">No hay trades en este período</h3>
          <p className="text-muted-foreground">
            Ajusta los filtros o realiza tu primera operación
          </p>
        </div>
      )}
    </div>
  );
}
