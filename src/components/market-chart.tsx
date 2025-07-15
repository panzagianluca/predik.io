"use client";

import { Market, BinaryMarket, MultipleChoiceMarket } from '@/types/market';

interface MarketChartProps {
  market: Market;
}

export function MarketChart({ market }: MarketChartProps) {
  // Mock data for the chart - in a real app this would come from your API
  const mockChartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    if (market.type === 'binary') {
      const basePrice = (market as BinaryMarket).yesPrice;
      const variation = (Math.random() - 0.5) * 0.1;
      return {
        date: date.toISOString().split('T')[0],
        yesPrice: Math.max(0.05, Math.min(0.95, basePrice + variation)),
        noPrice: Math.max(0.05, Math.min(0.95, 1 - (basePrice + variation)))
      };
    } else {
      return {
        date: date.toISOString().split('T')[0],
        options: (market as MultipleChoiceMarket).options.map(option => ({
          id: option.id,
          price: Math.max(0.05, Math.min(0.95, option.price + (Math.random() - 0.5) * 0.05))
        }))
      };
    }
  });

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Gráfico de Precios</h3>
        <div className="flex space-x-2 text-xs text-muted-foreground">
          <button className="px-2 py-1 rounded bg-muted">1D</button>
          <button className="px-2 py-1 rounded">7D</button>
          <button className="px-2 py-1 rounded">1M</button>
          <button className="px-2 py-1 rounded">3M</button>
          <button className="px-2 py-1 rounded">Todo</button>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center mb-4">
        <div className="text-center text-muted-foreground">
          <div className="text-2xl mb-2">📈</div>
          <div className="text-sm">Gráfico de precios en tiempo real</div>
          <div className="text-xs">Próximamente con datos históricos</div>
        </div>
      </div>

      {/* Current Prices Display */}
      {market.type === 'binary' ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700 font-medium">SÍ</div>
            <div className="text-2xl font-bold text-green-800">
              ${((market as BinaryMarket).yesPrice * 100).toFixed(0)}¢
            </div>
            <div className="text-xs text-green-600">
              +2.3% últimas 24h
            </div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm text-red-700 font-medium">NO</div>
            <div className="text-2xl font-bold text-red-800">
              ${((market as BinaryMarket).noPrice * 100).toFixed(0)}¢
            </div>
            <div className="text-xs text-red-600">
              -2.3% últimas 24h
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {(market as MultipleChoiceMarket).options.map((option, index) => (
            <div key={option.id} className="flex justify-between items-center p-2 rounded-lg border">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: option.color }}
                ></div>
                <span className="font-medium">{option.text}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  ${(option.price * 100).toFixed(0)}¢
                </div>
                <div className={`text-xs ${index % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {index % 2 === 0 ? '+' : '-'}{(Math.random() * 5).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Market Stats */}
      <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-muted-foreground">Volumen 24h</div>
          <div className="font-semibold">${(market.volume * 0.1).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Trades 24h</div>
          <div className="font-semibold">{Math.floor(market.participants * 0.3)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Liquidez</div>
          <div className="font-semibold">${(market.volume * 0.05).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
