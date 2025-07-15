"use client";

import { useState, useEffect } from 'react';
import { Market, BinaryMarket, MultipleChoiceMarket } from '@/types/market';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketChartProps {
  market: Market;
}

export function MarketChart({ market }: MarketChartProps) {
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [percentageChanges, setPercentageChanges] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Generate deterministic mock data based on market ID
    const seedRandom = (seed: number) => {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Mock data for the chart - in a real app this would come from your API
    const mockData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      if (market.type === 'binary') {
        const basePrice = (market as BinaryMarket).yesPrice;
        const variation = (seedRandom(market.id * 100 + i) - 0.5) * 0.1;
        return {
          date: date.toLocaleDateString('es-AR'),
          yesPrice: Math.max(0.05, Math.min(0.95, basePrice + variation)),
          noPrice: Math.max(0.05, Math.min(0.95, 1 - (basePrice + variation)))
        };
      } else {
        const dataPoint: any = {
          date: date.toLocaleDateString('es-AR')
        };
        
        // Add each option as a separate data key for the chart
        (market as MultipleChoiceMarket).options.forEach((option, optionIndex) => {
          const variation = (seedRandom(market.id * 100 + i + optionIndex) - 0.5) * 0.05;
          dataPoint[`option_${option.id}`] = Math.max(0.05, Math.min(0.95, option.price + variation));
        });
        
        return dataPoint;
      }
    });

    setChartData(mockData);

    // Generate deterministic percentage changes for options
    if (market.type === 'multiple') {
      const changes = (market as MultipleChoiceMarket).options.map((_, index) => {
        const change = (seedRandom(market.id * 10 + index) - 0.5) * 10; // -5% to +5%
        return Number(change.toFixed(1));
      });
      setPercentageChanges(changes);
    }
  }, [market.id, market.type]);

  // Show loading state during SSR
  if (!mounted) {
    return (
      <div className="border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gráfico de Precios</h3>
          <div className="flex space-x-2 text-xs">
            <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium">1D</button>
            <button className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">7D</button>
            <button className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">1M</button>
            <button className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">3M</button>
            <button className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">Todo</button>
          </div>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className="h-80 bg-card rounded-lg border p-4 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [`${(value * 100).toFixed(1)}%`, name]}
              labelFormatter={(label) => `Fecha: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            {market.type === 'binary' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="yesPrice" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={false}
                  name="SÍ"
                  strokeLinecap="round"
                />
                <Line 
                  type="monotone" 
                  dataKey="noPrice" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={false}
                  name="NO"
                  strokeLinecap="round"
                />
              </>
            ) : (
              (market as MultipleChoiceMarket).options.slice(0, 4).map((option, index) => (
                <Line 
                  key={option.id}
                  type="monotone" 
                  dataKey={`option_${option.id}`}
                  stroke={option.color} 
                  strokeWidth={3}
                  dot={false}
                  name={option.text}
                  strokeLinecap="round"
                />
              ))
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Prices Display */}
      {market.type === 'binary' ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700 font-medium">SÍ</div>
            <div className="text-2xl font-bold text-green-800">
              {((market as BinaryMarket).yesPrice * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-green-600">
              +2.3% últimas 24h
            </div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm text-red-700 font-medium">NO</div>
            <div className="text-2xl font-bold text-red-800">
              {((market as BinaryMarket).noPrice * 100).toFixed(0)}%
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
                  {(option.price * 100).toFixed(0)}%
                </div>
                <div className={`text-xs ${percentageChanges[index] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {percentageChanges[index] >= 0 ? '+' : ''}{percentageChanges[index]}%
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
