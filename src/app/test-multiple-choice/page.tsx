"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { tradingService } from '../../../lib/supabase/trading';

export default function TestMultipleChoicePage() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, result: any, success: boolean) => {
    setTestResults(prev => [...prev, { test, result, success, timestamp: new Date() }]);
  };

  const runAllTests = async () => {
    if (!user) {
      alert('Debes iniciar sesión para ejecutar las pruebas');
      return;
    }

    setIsLoading(true);
    setTestResults([]);

    try {
      // Test 1: Get Markets with Options
      console.log('🧪 Test 1: Fetching markets with options...');
      const markets = await tradingService.getActiveMarkets();
      addResult('Get Markets with Options', { 
        count: markets.length, 
        multipleChoiceMarkets: markets.filter(m => m.type === 'multiple').length,
        sampleOptions: markets.find(m => m.type === 'multiple')?.options 
      }, true);

      // Test 2: Get User Profile and Balance
      console.log('🧪 Test 2: Getting user profile...');
      const profile = await tradingService.getUserProfile(user.id);
      addResult('Get User Profile', { 
        balance: profile?.balance, 
        username: profile?.username 
      }, !!profile);

      // Find a multiple choice market for testing
      const multipleChoiceMarket = markets.find(m => m.type === 'multiple');
      
      if (multipleChoiceMarket && multipleChoiceMarket.options && multipleChoiceMarket.options.length > 0) {
        // Test 3: Execute Option Trade
        console.log('🧪 Test 3: Executing option trade...');
        const firstOption = multipleChoiceMarket.options[0];
        
        try {
          const tradeResult = await tradingService.executeOptionTrade(
            (multipleChoiceMarket as any).uuid || multipleChoiceMarket.id.toString(), // Use real UUID
            user.id,
            firstOption.id,
            'buy_option',
            10.00
          );
          
          console.log('📊 Full trade result:', tradeResult);
          addResult('Execute Option Trade', tradeResult, tradeResult.success);
        } catch (error) {
          console.error('🚨 Option trade error:', error);
          addResult('Execute Option Trade', { 
            error: error instanceof Error ? error.message : 'Unknown error',
            fullError: error 
          }, false);
        }

        // Test 4: Get Updated Market Details
        console.log('🧪 Test 4: Getting updated market details...');
        const marketDetails = await tradingService.getMarketDetails((multipleChoiceMarket as any).uuid || multipleChoiceMarket.id.toString());
        addResult('Get Market Details', {
          optionsCount: marketDetails?.options?.length || marketDetails?.market_options?.length,
          hasOptions: !!marketDetails?.options || !!marketDetails?.market_options
        }, !!marketDetails);

        // Test 5: Get User Positions
        console.log('🧪 Test 5: Getting user positions...');
        const positions = await tradingService.getUserPositions(user.id);
        addResult('Get User Positions', {
          totalPositions: positions.length,
          optionPositions: positions.filter(p => p.position_type === 'option').length
        }, true);

      } else {
        addResult('Multiple Choice Market Not Found', { 
          availableMarkets: markets.map(m => ({ id: m.id, type: m.type, title: m.title }))
        }, false);
      }

    } catch (error) {
      console.error('Test error:', error);
      addResult('Test Suite Error', { error: error instanceof Error ? error.message : 'Unknown error' }, false);
    } finally {
      setIsLoading(false);
    }
  };

  const testSpecificOption = async (marketId: string, optionId: string, amount: number = 5.00) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await tradingService.executeOptionTrade(
        marketId,
        user.id,
        optionId,
        'buy_option',
        amount
      );
      
      addResult(`Manual Option Trade (${marketId.slice(0, 8)}...)`, result, result.success);
    } catch (error) {
      addResult(`Manual Option Trade Error`, { error: error instanceof Error ? error.message : 'Unknown error' }, false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">🧪 Multiple Choice Trading Tests</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p>Debes iniciar sesión para ejecutar las pruebas de trading.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧪 Multiple Choice Trading Tests</h1>
      
      <div className="mb-6">
        <button 
          onClick={runAllTests}
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Ejecutando pruebas...' : 'Ejecutar Todas las Pruebas'}
        </button>
      </div>

      {/* Quick Manual Tests */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Pruebas Manuales Rápidas</h3>
        <div className="space-x-2">
          <button 
            onClick={() => testSpecificOption('b2c3d4e5-f6a7-8901-2345-678901bcdefb', 'c0de1234-5678-9abc-def0-123456789abc', 5.00)}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            disabled={isLoading}
          >
            Test Elecciones - Javier Milei ($5)
          </button>
          <button 
            onClick={() => testSpecificOption('e5f6a7b8-c9d0-1234-5678-901234efabcd', 'a1b2c3d4-5678-9abc-def0-123456789abc', 3.00)}
            className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
            disabled={isLoading}
          >
            Test Tech - Inteligencia Artificial ($3)
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Resultados de las Pruebas</h2>
        
        {testResults.length === 0 && !isLoading && (
          <div className="text-gray-500 italic">No hay resultados aún. Ejecuta las pruebas para ver los resultados.</div>
        )}

        {testResults.map((result, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-4 ${
              result.success 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center">
                {result.success ? '✅' : '❌'} {result.test}
              </h3>
              <span className="text-sm text-gray-500">
                {result.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(result.result, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
