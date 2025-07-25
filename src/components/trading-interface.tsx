"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Market, BinaryMarket, MultipleChoiceMarket } from '@/types/market';
import { Minus, Plus } from 'lucide-react';
import { tradingService } from '../../lib/supabase/trading';
import { useAuth } from '../../lib/auth/AuthProvider';

interface TradingInterfaceProps {
  market: Market;
  onTradeComplete?: () => void;
}

export function TradingInterface({ market, onTradeComplete }: TradingInterfaceProps) {
  const { user } = useAuth();
  const [selectedOutcome, setSelectedOutcome] = useState<string>(
    market.type === 'binary' ? 'yes' : market.options[0].id
  );
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tradeResult, setTradeResult] = useState<{ success: boolean; message: string } | null>(null);

  const getCurrentPrice = () => {
    if (market.type === 'binary') {
      return selectedOutcome === 'yes' 
        ? (market as BinaryMarket).yesPrice 
        : (market as BinaryMarket).noPrice;
    } else {
      const option = (market as MultipleChoiceMarket).options.find(o => o.id === selectedOutcome);
      return option?.price || 0;
    }
  };

  const getTotalCost = () => {
    return shares * getCurrentPrice();
  };

  const executeTrade = async () => {
    if (!user) {
      setTradeResult({ success: false, message: 'Debes iniciar sesión para realizar operaciones' });
      return;
    }

    setIsExecuting(true);
    setTradeResult(null);

    try {
      // Use the original UUID for database operations
      const marketUuid = market.uuid || market.id.toString();
      const amount = getTotalCost();

      let result;

      if (market.type === 'binary') {
        // Binary market trading
        const binaryTradeType = selectedOutcome === 'yes' ? 'buy_yes' : 'buy_no';
        result = await tradingService.executeBinaryTrade(
          marketUuid,
          user.id,
          binaryTradeType,
          amount
        );
      } else {
        // Multiple choice option trading
        result = await tradingService.executeOptionTrade(
          marketUuid,
          user.id,
          selectedOutcome, // Option ID
          'buy_option',
          amount
        );
      }

      if (result.success) {
        setTradeResult({ 
          success: true, 
          message: `¡Operación exitosa! Compraste ${result.shares_bought?.toFixed(2)} acciones a $${result.price_per_share?.toFixed(2)} cada una.` 
        });
        // Reset form
        setShares(10);
        // Notify parent component to refresh data
        onTradeComplete?.();
      } else {
        setTradeResult({ 
          success: false, 
          message: result.error || 'Error al ejecutar la operación' 
        });
      }
    } catch (error) {
      console.error('Error executing trade:', error);
      setTradeResult({ 
        success: false, 
        message: 'Error de conexión. Inténtalo de nuevo.' 
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTrade = () => {
    setIsModalOpen(true);
    setTradeResult(null);
  };

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Trading</h3>
        
        {/* Buy/Sell Toggle */}
        <div className="flex rounded-lg border p-1 mb-4">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tradeType === 'buy'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Comprar
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tradeType === 'sell'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Vender
          </button>
        </div>

        {/* Outcome Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Selecciona resultado</label>
          {market.type === 'binary' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedOutcome('yes')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedOutcome === 'yes'
                    ? 'border-green-500 bg-green-50'
                    : 'border-border hover:border-green-300'
                }`}
              >
                <div className="text-sm font-medium">SÍ</div>
                <div className="text-2xl font-bold text-green-800">
                  {((market as BinaryMarket).yesPrice * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-green-600">
                  ${((market as BinaryMarket).yesPrice * 100).toFixed(0)}¢
                </div>
              </button>
              <button
                onClick={() => setSelectedOutcome('no')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedOutcome === 'no'
                    ? 'border-red-500 bg-red-50'
                    : 'border-border hover:border-red-300'
                }`}
              >
                <div className="text-sm font-medium">NO</div>
                <div className="text-2xl font-bold text-red-800">
                  {((market as BinaryMarket).noPrice * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-red-600">
                  ${((market as BinaryMarket).noPrice * 100).toFixed(0)}¢
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {(market as MultipleChoiceMarket).options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOutcome(option.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedOutcome === option.id
                      ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/5'
                      : 'border-border hover:border-[rgb(var(--primary))]/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.text}</span>
                    <div className="text-right">
                      <div 
                        className="text-lg font-bold text-white px-2 py-1 rounded"
                        style={{ backgroundColor: option.color }}
                      >
                        {(option.price * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ${(option.price * 100).toFixed(0)}¢
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shares Input */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Cantidad de acciones</label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShares(Math.max(1, shares - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 text-center border rounded-md py-2 px-3"
              min="1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShares(shares + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cost Calculation */}
        <div className="mb-6 p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Precio por acción:</span>
            <div className="text-right">
              <div className="font-semibold">{(getCurrentPrice() * 100).toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">${(getCurrentPrice() * 100).toFixed(0)}¢</div>
            </div>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Cantidad:</span>
            <span>{shares} acciones</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${getTotalCost().toFixed(2)}</span>
          </div>
        </div>

        {/* Trade Button */}
        <Button 
          onClick={handleTrade}
          className="w-full"
          size="lg"
        >
          {tradeType === 'buy' ? 'Comprar' : 'Vender'} {shares} acciones
        </Button>

        <div className="mt-3 text-xs text-muted-foreground text-center">
          💰 Saldo demo: $1,000.00
        </div>
      </div>

      {/* Mock Trade Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmar Operación</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Mercado:</span>
                <span className="font-medium">{market.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Resultado:</span>
                <span className="font-medium">
                  {market.type === 'binary' 
                    ? (selectedOutcome === 'yes' ? 'SÍ' : 'NO')
                    : (market as MultipleChoiceMarket).options.find(o => o.id === selectedOutcome)?.text
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tipo:</span>
                <span className="font-medium">{tradeType === 'buy' ? 'Compra' : 'Venta'}</span>
              </div>
              <div className="flex justify-between">
                <span>Cantidad:</span>
                <span className="font-medium">{shares} acciones</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">${getTotalCost().toFixed(2)}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
                disabled={isExecuting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={executeTrade}
                className="flex-1"
                disabled={isExecuting || !user}
              >
                {isExecuting ? 'Procesando...' : 'Confirmar'}
              </Button>
            </div>

            {/* Trade Result Display */}
            {tradeResult && (
              <div className={`mt-4 p-3 rounded-lg ${
                tradeResult.success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm">{tradeResult.message}</p>
                {tradeResult.success && (
                  <Button 
                    onClick={() => setIsModalOpen(false)}
                    className="mt-2 w-full"
                    size="sm"
                  >
                    Cerrar
                  </Button>
                )}
              </div>
            )}

            {!user && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
                <p className="text-sm">Debes iniciar sesión para realizar operaciones.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
