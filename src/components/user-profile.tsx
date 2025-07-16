"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User as UserIcon, 
  Edit2,
  Calendar,
  TrendingUp,
  History,
  BarChart3,
  Heart
} from 'lucide-react';
import { useUserProfile, useUserPositions, useTradeHistory } from '../hooks/useUserData';

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'history' | 'stats' | 'watchlist'>('portfolio');
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const { positions, loading: positionsLoading } = useUserPositions();
  const { trades, loading: tradesLoading } = useTradeHistory();

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getLevelName = (level: number) => {
    if (level < 3) return 'Novato';
    if (level < 6) return 'Trader';
    if (level < 10) return 'Experto';
    return 'Master';
  };

  // Calculate user stats from real data
  const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealized_pnl, 0);
  const totalInvested = positions.reduce((sum, pos) => sum + pos.total_invested, 0);
  const activePositions = positions.filter(p => p.market_status === 'active').length;
  const completedTrades = trades.length;
  // Calculate win rate from successful positions (simplified calculation)
  const winningPositions = positions.filter(p => p.unrealized_pnl > 0).length;
  const totalPositions = positions.length;
  const winRate = totalPositions > 0 ? (winningPositions / totalPositions) * 100 : 0;

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { id: 'watchlist', label: 'Favoritos', icon: Heart }
  ];

  if (profileLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-red-600 mb-4">❌ Error cargando perfil: {profileError || 'Usuario no encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-white text-xl font-bold">
              {profile.full_name ? (
                getInitials(profile.full_name)
              ) : (
                getInitials(profile.username)
              )}
            </div>
            
            {/* User Info */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <Badge variant="secondary">
                  <UserIcon className="mr-1 h-3 w-3" />
                  {profile.is_admin ? 'Admin' : 'Usuario'}
                </Badge>
                <Badge variant="outline">
                  <BarChart3 className="mr-1 h-3 w-3" />
                  {profile.markets_traded} mercados
                </Badge>
              </div>
              <p className="text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3 inline" />
                Usuario activo
              </p>
            </div>
          </div>
        </div>

        {/* Balance and Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold text-green-600">
              ${profile.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">P&L Total</div>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Tasa de Aciertos</div>
            <div className="text-2xl font-bold">
              {winRate.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Volumen Total</div>
            <div className="text-2xl font-bold">
              ${profile.total_volume.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <div className="flex space-x-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'portfolio' && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2" />
            <p>Portfolio integrado en la página principal</p>
          </div>
        )}
        {activeTab === 'history' && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2" />
            <p>Historial de operaciones - {completedTrades} trades completados</p>
            <p className="text-sm mt-1">Tasa de éxito: {winRate.toFixed(1)}%</p>
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estadísticas Detalladas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Mercados Ganados</div>
                <div className="text-xl font-bold">{profile.markets_won}</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Mercados Operados</div>
                <div className="text-xl font-bold">{profile.markets_traded}</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Total Invertido</div>
                <div className="text-xl font-bold">${totalInvested.toFixed(2)}</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Posiciones Activas</div>
                <div className="text-xl font-bold">{activePositions}</div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'watchlist' && (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-8 w-8 mx-auto mb-2" />
            <p>Lista de mercados favoritos en desarrollo</p>
          </div>
        )}
      </div>
    </div>
  );
}
