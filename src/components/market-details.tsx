"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TradingInterface } from '@/components/trading-interface';
import { MarketChart } from '@/components/market-chart';
import { ActivityFeed } from '@/components/activity-feed';
import { Comments } from '@/components/comments';
import { Market } from '@/types/market';
import { ArrowLeft, Clock, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface MarketDetailsProps {
  market: Market;
}

export function MarketDetails({ market }: MarketDetailsProps) {
  const [bottomTab, setBottomTab] = useState<'activity' | 'comments'>('comments');

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a mercados
      </Link>

      {/* Market Banner */}
      <div className="mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white"></div>
          
          <div className="relative flex flex-col md:flex-row gap-6 h-full">
            {/* Left Side - Market Image */}
            <div className="flex-shrink-0 h-full">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                {/* Placeholder image - you can replace with actual market images */}
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-4xl">
                    {market.category === 'Política' ? '🏛️' :
                     market.category === 'Economía' ? '💰' :
                     market.category === 'Deporte' ? '⚽' : '📊'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Market Information */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                {/* Tags and Status */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-sm font-medium">
                    {market.category}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {market.type === 'binary' ? 'SÍ/NO' : 'Múltiples opciones'}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    market.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {market.status === 'active' ? 'Activo' : 'Cerrado'}
                  </span>
                </div>
                
                {/* Title and Description */}
                <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight text-gray-900">{market.title}</h1>
                <p className="text-gray-600 mb-4 leading-relaxed">{market.description}</p>
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div className="text-sm text-gray-500">Volumen</div>
                  </div>
                  <div className="font-bold text-lg text-gray-900">${market.volume.toLocaleString()}</div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div className="text-sm text-gray-500">Traders</div>
                  </div>
                  <div className="font-bold text-lg text-gray-900">{market.participants}</div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div className="text-sm text-gray-500">Cierra</div>
                  </div>
                  <div className="font-bold text-sm text-gray-900">
                    {new Date(market.endDate).toLocaleDateString('es-AR')}
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div className="text-sm text-gray-500">Creado</div>
                  </div>
                  <div className="font-bold text-sm text-gray-900">
                    {new Date(market.createdAt).toLocaleDateString('es-AR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Chart and Comments/Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <MarketChart market={market} />
          
          {/* Comments/Activity Section */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-4">
                <button
                  onClick={() => setBottomTab('comments')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    bottomTab === 'comments'
                      ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Comentarios
                </button>
                <button
                  onClick={() => setBottomTab('activity')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    bottomTab === 'activity'
                      ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Actividad
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {bottomTab === 'comments' ? (
              <Comments marketId={market.id} />
            ) : (
              <ActivityFeed marketId={market.id} />
            )}
          </div>
        </div>

        {/* Right Column - Trading Interface and Positions */}
        <div className="space-y-6">
          <TradingInterface market={market} />

          {/* Positions Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tus Posiciones</h3>
            <div className="text-sm text-muted-foreground">
              Inicia sesión para ver tus posiciones
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
