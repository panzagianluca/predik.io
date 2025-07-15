"use client";

interface ActivityFeedProps {
  marketId: number;
}

interface ActivityItem {
  id: string;
  type: 'trade';
  user: string;
  action: 'compró' | 'vendió';
  outcome: string;
  shares: number;
  price: number;
  timestamp: string;
}

export function ActivityFeed({ marketId }: ActivityFeedProps) {
  // Mock activity data - only buy/sell trades
  const mockActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'trade',
      user: 'Carlos_M',
      action: 'compró',
      outcome: 'SÍ',
      shares: 50,
      price: 0.65,
      timestamp: '2024-07-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'trade',
      user: 'MariaB22',
      action: 'vendió',
      outcome: 'NO',
      shares: 25,
      price: 0.35,
      timestamp: '2024-07-15T10:15:00Z'
    },
    {
      id: '3',
      type: 'trade',
      user: 'InversorBA',
      action: 'compró',
      outcome: 'SÍ',
      shares: 100,
      price: 0.63,
      timestamp: '2024-07-15T09:30:00Z'
    },
    {
      id: '4',
      type: 'trade',
      user: 'TradingPro',
      action: 'vendió',
      outcome: 'SÍ',
      shares: 75,
      price: 0.64,
      timestamp: '2024-07-15T08:45:00Z'
    },
    {
      id: '5',
      type: 'trade',
      user: 'ApostadorPro',
      action: 'compró',
      outcome: 'NO',
      shares: 30,
      price: 0.38,
      timestamp: '2024-07-15T08:20:00Z'
    },
    {
      id: '6',
      type: 'trade',
      user: 'EconomistBA',
      action: 'vendió',
      outcome: 'NO',
      shares: 60,
      price: 0.36,
      timestamp: '2024-07-15T07:55:00Z'
    },
    {
      id: '7',
      type: 'trade',
      user: 'Inversor123',
      action: 'compró',
      outcome: 'SÍ',
      shares: 40,
      price: 0.66,
      timestamp: '2024-07-15T07:30:00Z'
    },
    {
      id: '8',
      type: 'trade',
      user: 'Trader_AR',
      action: 'vendió',
      outcome: 'NO',
      shares: 15,
      price: 0.34,
      timestamp: '2024-07-15T07:10:00Z'
    }
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  const getActionIcon = (action: 'compró' | 'vendió') => {
    return action === 'compró' ? '�' : '�';
  };

  const getOutcomeColor = (outcome: string) => {
    return outcome === 'SÍ' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Actividad Reciente</h3>
      
      <div className="space-y-3">
        {mockActivity.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
            <div className="text-lg">{getActionIcon(item.action)}</div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{item.user}</span>
                  <span className="text-muted-foreground"> {item.action} </span>
                  <span className={`font-medium ${getOutcomeColor(item.outcome)}`}>
                    {item.shares} {item.outcome}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}a ${(item.price * 100).toFixed(0)}¢
                  </span>
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <button className="text-sm text-[rgb(var(--primary))] hover:underline">
          Ver más actividad
        </button>
      </div>
    </div>
  );
}
