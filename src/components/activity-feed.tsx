"use client";

interface ActivityFeedProps {
  marketId: number;
}

interface ActivityItem {
  id: string;
  type: 'trade' | 'comment' | 'market_update';
  user: string;
  action: string;
  outcome?: string;
  shares?: number;
  price?: number;
  timestamp: string;
  comment?: string;
}

export function ActivityFeed({ marketId }: ActivityFeedProps) {
  // Mock activity data
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
      type: 'comment',
      user: 'PoliticoArgento',
      action: 'comentó',
      comment: 'Las encuestas recientes muestran una tendencia interesante...',
      timestamp: '2024-07-15T09:45:00Z'
    },
    {
      id: '4',
      type: 'trade',
      user: 'InversorBA',
      action: 'compró',
      outcome: 'SÍ',
      shares: 100,
      price: 0.63,
      timestamp: '2024-07-15T09:30:00Z'
    },
    {
      id: '5',
      type: 'market_update',
      user: 'Sistema',
      action: 'actualizó',
      comment: 'Nuevo volumen récord alcanzado: $125,000',
      timestamp: '2024-07-15T09:00:00Z'
    },
    {
      id: '6',
      type: 'trade',
      user: 'TradingPro',
      action: 'vendió',
      outcome: 'SÍ',
      shares: 75,
      price: 0.64,
      timestamp: '2024-07-15T08:45:00Z'
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

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return '💹';
      case 'comment':
        return '💬';
      case 'market_update':
        return '📊';
      default:
        return '📈';
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    if (!outcome) return '';
    return outcome === 'SÍ' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Actividad Reciente</h3>
      
      <div className="space-y-3">
        {mockActivity.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
            <div className="text-lg">{getActionIcon(item.type)}</div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{item.user}</span>
                  <span className="text-muted-foreground"> {item.action} </span>
                  
                  {item.type === 'trade' && (
                    <>
                      <span className={`font-medium ${getOutcomeColor(item.outcome)}`}>
                        {item.shares} {item.outcome}
                      </span>
                      <span className="text-muted-foreground">
                        {' '}a ${(item.price! * 100).toFixed(0)}¢
                      </span>
                    </>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
              
              {item.comment && (
                <div className="text-sm text-muted-foreground mt-1">
                  {item.comment}
                </div>
              )}
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
