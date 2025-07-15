"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TradingInterface } from '@/components/trading-interface';
import { MarketChart } from '@/components/market-chart';
import { ActivityFeed } from '@/components/activity-feed';
import { Market } from '@/types/market';
import { ArrowLeft, Clock, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface MarketDetailsProps {
  market: Market;
}

export function MarketDetails({ market }: MarketDetailsProps) {
  const [activeTab, setActiveTab] = useState<'trading' | 'activity'>('trading');

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a mercados
      </Link>

      {/* Market Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-full bg-[rgb(var(--primary))]/10 px-2.5 py-0.5 text-xs font-medium text-[rgb(var(--primary))]">
            {market.category}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {market.type === 'binary' ? 'SÍ/NO' : 'Múltiples opciones'}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            market.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {market.status === 'active' ? 'Activo' : 'Cerrado'}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">{market.title}</h1>
        <p className="text-lg text-muted-foreground mb-4">{market.description}</p>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Volumen</div>
              <div className="font-semibold">${market.volume.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Traders</div>
              <div className="font-semibold">{market.participants}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Cierra</div>
              <div className="font-semibold">
                {new Date(market.endDate).toLocaleDateString('es-AR')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Creado</div>
              <div className="font-semibold">
                {new Date(market.createdAt).toLocaleDateString('es-AR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2">
          <MarketChart market={market} />
        </div>

        {/* Right Column - Trading Interface */}
        <div className="space-y-6">
          <TradingInterface market={market} />

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('trading')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trading'
                    ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Posiciones
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Actividad
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'trading' ? (
            <div className="space-y-4">
              <h3 className="font-semibold">Tus Posiciones</h3>
              <div className="text-sm text-muted-foreground">
                Inicia sesión para ver tus posiciones
              </div>
            </div>
          ) : (
            <ActivityFeed marketId={market.id} />
          )}
        </div>
      </div>
    </div>
  );
}
