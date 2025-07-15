"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { 
  User as UserIcon, 
  Edit2,
  Calendar
} from 'lucide-react';

// Mock user data - would come from authentication/database
const mockUser: User = {
  id: 'user123',
  username: 'CarlosTrader',
  email: 'carlos@example.com',
  avatarUrl: undefined,
  createdAt: '2024-01-15T00:00:00Z',
  balance: 1250.75,
  totalVolume: 12500,
  winRate: 0.68,
  totalProfitLoss: 250.75,
  level: 5,
  experience: 1250
};

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'history' | 'stats' | 'watchlist'>('portfolio');

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getLevelName = (level: number) => {
    if (level < 3) return 'Novato';
    if (level < 6) return 'Trader';
    if (level < 10) return 'Experto';
    return 'Master';
  };

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { id: 'watchlist', label: 'Favoritos', icon: Heart }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-white text-xl font-bold">
              {mockUser.avatarUrl ? (
                <img 
                  src={mockUser.avatarUrl} 
                  alt={mockUser.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(mockUser.username)
              )}
            </div>
            
            {/* User Info */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold">{mockUser.username}</h1>
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <Badge variant="secondary">
                  <Trophy className="mr-1 h-3 w-3" />
                  Nivel {mockUser.level} - {getLevelName(mockUser.level)}
                </Badge>
                <Badge variant="outline">
                  <Target className="mr-1 h-3 w-3" />
                  {mockUser.experience} XP
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Miembro desde {new Date(mockUser.createdAt).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        </div>

        {/* Balance and Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold text-green-600">
              ${mockUser.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">P&L Total</div>
            <div className={`text-2xl font-bold ${mockUser.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {mockUser.totalProfitLoss >= 0 ? '+' : ''}${mockUser.totalProfitLoss.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Tasa de Aciertos</div>
            <div className="text-2xl font-bold">
              {(mockUser.winRate * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Volumen Total</div>
            <div className="text-2xl font-bold">
              ${mockUser.totalVolume.toLocaleString()}
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
        {activeTab === 'portfolio' && <Portfolio userId={mockUser.id} />}
        {activeTab === 'history' && <TradeHistory userId={mockUser.id} />}
        {activeTab === 'stats' && <UserStats userId={mockUser.id} />}
        {activeTab === 'watchlist' && <Watchlist userId={mockUser.id} />}
      </div>
    </div>
  );
}
