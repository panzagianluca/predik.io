"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Market } from '@/types/market';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  Star,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface WatchlistProps {
  userId: string;
}

// Mock watchlist data with extended types
interface WatchlistItem {
  id: number;
  title: string;
  description: string;
  type: 'binary' | 'multiple';
  category: string;
  endDate: string;
  volume: number;
  createdAt: string;
  participants: number;
  status: 'active' | 'closed' | 'resolved';
  addedAt: string;
  priceChange24h: number;
  lastActivity: string;
  notifications: boolean;
  // Additional fields for display
  yesPrice?: number;
  noPrice?: number;
  options?: Array<{ id: string; text: string; price: number; color: string; }>;
}

const mockWatchlist: WatchlistItem[] = [
  {
    id: 1,
    title: '¿Milei será reelecto en 2027?',
    description: 'Predicción sobre la reelección del actual presidente',
    type: 'binary',
    category: 'Política',
    endDate: '2027-10-24T23:59:59Z',
    volume: 125000,
    createdAt: '2024-01-15T10:00:00Z',
    participants: 2847,
    status: 'active',
    yesPrice: 0.62,
    noPrice: 0.38,
    addedAt: '2024-07-10T15:30:00Z',
    priceChange24h: +0.03,
    lastActivity: '2024-07-16T09:15:00Z',
    notifications: true
  },
  {
    id: 3,
    title: '¿El dólar superará los $2000 pesos en 2025?',
    description: 'Predicción sobre el tipo de cambio USD/ARS',
    type: 'binary',
    category: 'Economía',
    endDate: '2025-12-31T23:59:59Z',
    volume: 89000,
    createdAt: '2024-02-01T14:00:00Z',
    participants: 1923,
    status: 'active',
    yesPrice: 0.75,
    noPrice: 0.25,
    addedAt: '2024-07-08T11:20:00Z',
    priceChange24h: -0.02,
    lastActivity: '2024-07-16T14:30:00Z',
    notifications: false
  },
  {
    id: 5,
    title: '¿La inflación será menor al 50% en 2025?',
    description: 'Predicción sobre la tasa de inflación anual',
    type: 'binary',
    category: 'Economía',
    endDate: '2025-12-31T23:59:59Z',
    volume: 67000,
    createdAt: '2024-03-10T09:00:00Z',
    participants: 1456,
    status: 'active',
    yesPrice: 0.43,
    noPrice: 0.57,
    addedAt: '2024-07-05T16:45:00Z',
    priceChange24h: +0.05,
    lastActivity: '2024-07-16T11:20:00Z',
    notifications: true
  },
  {
    id: 4,
    title: '¿Cuántos goles hará Messi en el Mundial 2026?',
    description: 'Predicción sobre los goles de Messi en el próximo Mundial',
    type: 'multiple',
    category: 'Deportes',
    endDate: '2026-07-19T23:59:59Z',
    volume: 45000,
    createdAt: '2024-04-20T12:00:00Z',
    participants: 987,
    status: 'active',
    options: [
      { id: 'no-juega', text: 'No jugará', price: 0.15, color: '#ef4444' },
      { id: '0-goles', text: '0 goles', price: 0.20, color: '#f97316' },
      { id: '1-2-goles', text: '1-2 goles', price: 0.35, color: '#eab308' },
      { id: '3-5-goles', text: '3-5 goles', price: 0.25, color: '#22c55e' },
      { id: '6-mas-goles', text: '6+ goles', price: 0.05, color: '#8b5cf6' }
    ],
    addedAt: '2024-07-12T13:10:00Z',
    priceChange24h: +0.01,
    lastActivity: '2024-07-15T18:45:00Z',
    notifications: false
  }
];

export function Watchlist({ userId }: WatchlistProps) {
  const [filter, setFilter] = useState<'all' | 'binary' | 'multiple'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'activity' | 'volume'>('newest');

  const filteredMarkets = mockWatchlist
    .filter(market => filter === 'all' || market.type === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'activity':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        case 'volume':
          return b.volume - a.volume;
        default:
          return 0;
      }
    });

  const toggleNotifications = (marketId: number) => {
    // TODO: Implement notification toggle
    console.log('Toggle notifications for market:', marketId);
  };

  const removeFromWatchlist = (marketId: number) => {
    // TODO: Implement remove from watchlist
    console.log('Remove from watchlist:', marketId);
  };

  return (
    <div className="space-y-6">
      {/* Watchlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Mercados Seguidos</div>
          <div className="text-xl font-bold">
            {mockWatchlist.length}
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Con Notificaciones</div>
          <div className="text-xl font-bold text-[rgb(var(--primary))]">
            {mockWatchlist.filter(m => m.notifications).length}
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Cambio Promedio 24h</div>
          <div className="text-xl font-bold text-green-600">
            +{(mockWatchlist.reduce((sum, m) => sum + m.priceChange24h, 0) / mockWatchlist.length * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Volumen Total</div>
          <div className="text-xl font-bold">
            ${mockWatchlist.reduce((sum, m) => sum + m.volume, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
          
          <div className="flex rounded-lg border p-1">
            {(['all', 'binary', 'multiple'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  filter === type
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type === 'all' ? 'Todos' : type === 'binary' ? 'SÍ/NO' : 'Múltiple'}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border p-1">
            {(['newest', 'activity', 'volume'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  sortBy === sort
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {sort === 'newest' ? 'Recientes' : sort === 'activity' ? 'Actividad' : 'Volumen'}
              </button>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm">
          <Star className="mr-2 h-4 w-4" />
          Administrar Lista
        </Button>
      </div>

      {/* Watchlist Items */}
      <div className="space-y-4">
        {filteredMarkets.map((market) => (
          <div key={market.id} className="border rounded-lg p-4 bg-card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {market.type === 'binary' ? 'SÍ/NO' : 'Múltiple'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {market.category}
                  </Badge>
                  
                  <div className={`flex items-center space-x-1 text-xs ${
                    market.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {market.priceChange24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {market.priceChange24h >= 0 ? '+' : ''}{(market.priceChange24h * 100).toFixed(1)}%
                  </div>
                </div>
                
                <Link 
                  href={`/mercado/${market.id}`}
                  className="font-medium hover:text-[rgb(var(--primary))] mb-2 block text-lg"
                >
                  {market.title}
                </Link>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {market.description}
                </p>

                {/* Outcomes Display */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {market.type === 'binary' ? (
                    <>
                      <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded">
                        <span className="text-sm font-medium">SÍ</span>
                        <span className="text-sm text-[rgb(var(--primary))]">
                          {(market.yesPrice! * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded">
                        <span className="text-sm font-medium">NO</span>
                        <span className="text-sm text-[rgb(var(--primary))]">
                          {(market.noPrice! * 100).toFixed(0)}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {market.options?.slice(0, 3).map((option) => (
                        <div 
                          key={option.id} 
                          className="flex items-center space-x-2 bg-muted px-3 py-1 rounded"
                        >
                          <span className="text-sm font-medium">{option.text}</span>
                          <span className="text-sm text-[rgb(var(--primary))]">
                            {(option.price * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                      {market.options && market.options.length > 3 && (
                        <div className="bg-muted px-3 py-1 rounded text-sm text-muted-foreground">
                          +{market.options.length - 3} más
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Volumen</div>
                    <div className="font-medium">
                      ${market.volume.toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Participantes</div>
                    <div className="font-medium">
                      {market.participants.toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Finaliza</div>
                    <div className="font-medium">
                      {new Date(market.endDate).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Agregado</div>
                    <div className="font-medium">
                      {new Date(market.addedAt).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2 ml-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNotifications(market.id)}
                    className="h-8 w-8 p-0"
                  >
                    {market.notifications ? (
                      <Eye className="h-4 w-4 text-[rgb(var(--primary))]" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                
                <Link href={`/mercado/${market.id}`}>
                  <Button size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Mercado
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">👀</div>
          <h3 className="text-lg font-semibold mb-2">No hay mercados en tu lista</h3>
          <p className="text-muted-foreground mb-4">
            Agrega mercados a tu watchlist para seguir su evolución
          </p>
          <Link href="/">
            <Button>
              Explorar Mercados
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
