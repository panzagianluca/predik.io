"use client";

import { useState, useEffect } from 'react';
import { Market, BinaryMarket, MultipleChoiceMarket } from '@/types/market';
import { tradingService, PriceHistoryPoint } from '../../lib/supabase/trading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketChartProps {
  market: Market;
}

export function MarketChart({ market }: MarketChartProps) {
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [percentageChanges, setPercentageChanges] = useState<number[]>([]);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadPriceHistory();
  }, [market.uuid, timeframe]);

  const getHoursForTimeframe = (tf: string) => {
    switch (tf) {
      case '24h': return 24;
      case '7d': return 24 * 7;
      case '30d': return 24 * 30;
      case 'all': return 24 * 365; // Max 1 year
      default: return 24;
    }
  };

  const loadPriceHistory = async () => {
    setLoading(true);
    try {
      const hours = getHoursForTimeframe(timeframe);
      
      if (market.type === 'binary') {
        // For binary markets, get both YES and NO price history
        const { data: yesData } = await tradingService.getPriceHistory(market.uuid || '', undefined, hours);
        
        if (yesData && yesData.length > 0) {
          // Group by timestamp and combine YES/NO prices
          const priceMap = new Map();
          
          yesData.forEach((point: PriceHistoryPoint) => {
            const timestamp = new Date(point.timestamp).toISOString().split('T')[0];
            if (!priceMap.has(timestamp)) {
              priceMap.set(timestamp, { date: new Date(point.timestamp).toLocaleDateString('es-AR') });
            }
            
            if (point.price_type === 'yes') {
              priceMap.get(timestamp).yesPrice = point.price;
            } else if (point.price_type === 'no') {
              priceMap.get(timestamp).noPrice = point.price;
            }
          });
          
          const sortedData = Array.from(priceMap.values()).sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          setChartData(sortedData);
          
          // Calculate percentage changes
          if (sortedData.length >= 2) {
            const latest = sortedData[sortedData.length - 1];
            const previous = sortedData[sortedData.length - 2];
            const yesChange = latest.yesPrice && previous.yesPrice ? 
              ((latest.yesPrice - previous.yesPrice) / previous.yesPrice * 100) : 0;
            setPercentageChanges([yesChange, -yesChange]);
          }
        } else {
          // Fallback to current prices if no history
          setChartData([{
            date: new Date().toLocaleDateString('es-AR'),
            yesPrice: (market as BinaryMarket).yesPrice,
            noPrice: (market as BinaryMarket).noPrice
          }]);
        }
      } else {
        // For multiple choice markets, get price history for each option
        const multiMarket = market as MultipleChoiceMarket;
        const allPriceData: PriceHistoryPoint[] = [];
        
        // Fetch price history for all options
        for (const option of multiMarket.options) {
          const { data } = await tradingService.getPriceHistory(market.uuid || '', option.id, hours);
          if (data) {
            allPriceData.push(...data);
          }
        }
        
        if (allPriceData.length > 0) {
          // Group by timestamp
          const priceMap = new Map();
          
          allPriceData.forEach((point: PriceHistoryPoint) => {
            const timestamp = new Date(point.timestamp).toISOString().split('T')[0];
            if (!priceMap.has(timestamp)) {
              priceMap.set(timestamp, { date: new Date(point.timestamp).toLocaleDateString('es-AR') });
            }
            
            if (point.option_id) {
              priceMap.get(timestamp)[`option_${point.option_id}`] = point.price;
            }
          });
          
          const sortedData = Array.from(priceMap.values()).sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          setChartData(sortedData);
          
          // Calculate percentage changes for each option
          if (sortedData.length >= 2) {
            const latest = sortedData[sortedData.length - 1];
            const previous = sortedData[sortedData.length - 2];
            const changes = multiMarket.options.map(option => {
              const latestPrice = latest[`option_${option.id}`];
              const previousPrice = previous[`option_${option.id}`];
              return latestPrice && previousPrice ? 
                ((latestPrice - previousPrice) / previousPrice * 100) : 0;
            });
            setPercentageChanges(changes);
          }
        } else {
          // Fallback to current prices
          const dataPoint: any = {
            date: new Date().toLocaleDateString('es-AR')
          };
          multiMarket.options.forEach(option => {
            dataPoint[`option_${option.id}`] = option.price;
          });
          setChartData([dataPoint]);
        }
      }
    } catch (error) {
      console.error('Error loading price history:', error);
      // Fallback to current market prices
      if (market.type === 'binary') {
        setChartData([{
          date: new Date().toLocaleDateString('es-AR'),
          yesPrice: (market as BinaryMarket).yesPrice,
          noPrice: (market as BinaryMarket).noPrice
        }]);
      } else {
        const dataPoint: any = {
          date: new Date().toLocaleDateString('es-AR')
        };
        (market as MultipleChoiceMarket).options.forEach(option => {
          dataPoint[`option_${option.id}`] = option.price;
        });
        setChartData([dataPoint]);
      }
    } finally {
      setLoading(false);
    }
  };

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
            <button 
              onClick={() => setTimeframe('24h')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeframe === '24h' 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'hover:bg-muted'
              }`}
            >
              1D
            </button>
            <button 
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeframe === '7d' 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'hover:bg-muted'
              }`}
            >
              7D
            </button>
            <button 
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeframe === '30d' 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'hover:bg-muted'
              }`}
            >
              1M
            </button>
            <button 
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeframe === 'all' 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'hover:bg-muted'
              }`}
            >
              Todo
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className="h-80 bg-card rounded-lg border p-4 mb-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Cargando datos del gráfico...</div>
          </div>
        ) : (
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
        )}
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
              {percentageChanges[0] >= 0 ? '+' : ''}{percentageChanges[0]?.toFixed(1) || '0.0'}% últimas 24h
            </div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm text-red-700 font-medium">NO</div>
            <div className="text-2xl font-bold text-red-800">
              {((market as BinaryMarket).noPrice * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-red-600">
              {percentageChanges[1] >= 0 ? '+' : ''}{percentageChanges[1]?.toFixed(1) || '0.0'}% últimas 24h
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
