"use client";

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Award,
  BarChart3,
  DollarSign,
  Percent,
  Trophy,
  Star
} from 'lucide-react';

interface UserStatsProps {
  userId: string;
}

// Mock detailed stats data
const mockStats = {
  accuracy: {
    overall: 67.5,
    binary: 72.3,
    multiple: 61.8,
    thisMonth: 75.0
  },
  winLoss: {
    totalTrades: 47,
    winningTrades: 32,
    losingTrades: 15,
    winRate: 68.1
  },
  pnl: {
    totalProfit: 234.50,
    bestDay: 45.30,
    worstDay: -18.75,
    profitableDays: 18,
    totalDays: 25
  },
  activity: {
    activeDays: 25,
    avgTradesPerDay: 1.9,
    longestStreak: 8,
    currentStreak: 3
  },
  achievements: [
    {
      id: 'first-trade',
      title: 'Primera Apuesta',
      description: 'Realizaste tu primera operación',
      icon: '🎯',
      unlockedAt: '2024-07-01T10:00:00Z',
      rarity: 'common'
    },
    {
      id: 'prophet',
      title: 'Profeta',
      description: '10 predicciones correctas seguidas',
      icon: '🔮',
      unlockedAt: '2024-07-08T15:30:00Z',
      rarity: 'rare'
    },
    {
      id: 'big-win',
      title: 'Ganancia Grande',
      description: 'Ganaste más de $50 en un solo trade',
      icon: '💰',
      unlockedAt: '2024-07-12T09:15:00Z',
      rarity: 'epic'
    },
    {
      id: 'volume-trader',
      title: 'Trader de Volumen',
      description: 'Operaste más de $500 en total',
      icon: '📈',
      unlockedAt: '2024-07-15T14:20:00Z',
      rarity: 'rare'
    }
  ],
  categories: [
    { name: 'Política', trades: 18, accuracy: 72.2, profit: 145.30 },
    { name: 'Economía', trades: 15, accuracy: 66.7, profit: 67.80 },
    { name: 'Deportes', trades: 8, accuracy: 62.5, profit: 12.40 },
    { name: 'Entretenimiento', trades: 6, accuracy: 50.0, profit: 9.00 }
  ]
};

export function UserStats({ userId }: UserStatsProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Accuracy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-[rgb(var(--primary))]" />
            <Badge variant="outline">General</Badge>
          </div>
          <div className="text-2xl font-bold mb-1">
            {mockStats.accuracy.overall}%
          </div>
          <div className="text-sm text-muted-foreground">
            Precisión general
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <Badge variant="outline">SÍ/NO</Badge>
          </div>
          <div className="text-2xl font-bold mb-1">
            {mockStats.accuracy.binary}%
          </div>
          <div className="text-sm text-muted-foreground">
            Mercados binarios
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <Badge variant="outline">Múltiple</Badge>
          </div>
          <div className="text-2xl font-bold mb-1">
            {mockStats.accuracy.multiple}%
          </div>
          <div className="text-sm text-muted-foreground">
            Elección múltiple
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <Badge variant="outline">Este mes</Badge>
          </div>
          <div className="text-2xl font-bold mb-1">
            {mockStats.accuracy.thisMonth}%
          </div>
          <div className="text-sm text-muted-foreground">
            Julio 2024
          </div>
        </div>
      </div>

      {/* Win/Loss Stats */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Estadísticas de Victoria
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Tasa de Victoria</span>
              <span className="text-lg font-bold text-green-600">
                {mockStats.winLoss.winRate}%
              </span>
            </div>
            <Progress 
              value={mockStats.winLoss.winRate} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{mockStats.winLoss.winningTrades} ganados</span>
              <span>{mockStats.winLoss.losingTrades} perdidos</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Trades</span>
              <span className="font-medium">{mockStats.winLoss.totalTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Trades Ganadores</span>
              <span className="font-medium text-green-600">
                {mockStats.winLoss.winningTrades}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Trades Perdedores</span>
              <span className="font-medium text-red-600">
                {mockStats.winLoss.losingTrades}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* P&L Stats */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Ganancia & Pérdida
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Ganancia Total</div>
            <div className="text-xl font-bold text-green-600">
              +${mockStats.pnl.totalProfit}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Mejor Día</div>
            <div className="text-xl font-bold text-green-600">
              +${mockStats.pnl.bestDay}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Peor Día</div>
            <div className="text-xl font-bold text-red-600">
              ${mockStats.pnl.worstDay}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Días Rentables</div>
            <div className="text-xl font-bold">
              {mockStats.pnl.profitableDays}/{mockStats.pnl.totalDays}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Actividad
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Días Activos</div>
            <div className="text-xl font-bold">
              {mockStats.activity.activeDays}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Trades por Día</div>
            <div className="text-xl font-bold">
              {mockStats.activity.avgTradesPerDay}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Mejor Racha</div>
            <div className="text-xl font-bold">
              {mockStats.activity.longestStreak}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Racha Actual</div>
            <div className="text-xl font-bold">
              {mockStats.activity.currentStreak}
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Percent className="mr-2 h-5 w-5" />
          Rendimiento por Categoría
        </h3>
        
        <div className="space-y-4">
          {mockStats.categories.map((category, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{category.name}</h4>
                <Badge variant="outline">
                  {category.trades} trades
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Precisión</div>
                  <div className="font-bold text-[rgb(var(--primary))]">
                    {category.accuracy}%
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground">Ganancia</div>
                  <div className="font-bold text-green-600">
                    +${category.profit}
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground">ROI</div>
                  <div className="font-bold">
                    {((category.profit / (category.trades * 20)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Award className="mr-2 h-5 w-5" />
          Logros Desbloqueados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockStats.achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRarityColor(achievement.rarity)}`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Desbloqueado el{' '}
                    {new Date(achievement.unlockedAt).toLocaleDateString('es-AR')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
