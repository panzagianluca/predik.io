"use client";

import { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';

export default function CreateTestMarketsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createTestMarkets = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const supabase = createClient();
      
      // Insert test markets with proper UUIDs (only hex characters 0-9, a-f)
      const marketUuids = [
        'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        'b2c3d4e5-f6a7-8901-2345-678901bcdefb',
        'c3d4e5f6-a7b8-9012-3456-789012cdefab',
        'd4e5f6a7-b8c9-0123-4567-890123defabc',
        'e5f6a7b8-c9d0-1234-5678-901234efabcd'
      ];

      const testMarkets = [
        {
          id: marketUuids[0],
          title: '¿Bitcoin superará los $100,000 en 2025?',
          description: '¿El precio de Bitcoin superará los $100,000 USD antes del final de 2025?',
          category: 'Tecnología',
          type: 'binary',
          status: 'active',
          end_date: '2025-12-31',
          total_volume: 50000,
          participant_count: 120
        },
        {
          id: marketUuids[1],
          title: '¿Quién ganará las próximas elecciones presidenciales de Argentina?',
          description: 'Predicción sobre el ganador de las elecciones presidenciales argentinas de 2027',
          category: 'Política',
          type: 'multiple',
          status: 'active',
          end_date: '2027-10-30',
          total_volume: 75000,
          participant_count: 850
        },
        {
          id: marketUuids[2],
          title: '¿La inflación de Argentina será menor al 50% en 2025?',
          description: '¿La inflación anual argentina será inferior al 50% durante el año 2025?',
          category: 'Economía',
          type: 'binary',
          status: 'active',
          end_date: '2025-12-31',
          total_volume: 90000,
          participant_count: 450
        },
        {
          id: marketUuids[3],
          title: '¿River Plate ganará la Copa Libertadores 2025?',
          description: 'Predicción sobre si River Plate ganará la Copa Libertadores de 2025',
          category: 'Deporte',
          type: 'binary',
          status: 'active',
          end_date: '2025-11-30',
          total_volume: 35000,
          participant_count: 280
        },
        {
          id: marketUuids[4],
          title: '¿Qué tecnología será más adoptada en 2025?',
          description: 'Predicción sobre qué tecnología tendrá mayor adopción durante 2025',
          category: 'Tecnología',
          type: 'multiple',
          status: 'active',
          end_date: '2025-12-31',
          total_volume: 60000,
          participant_count: 350
        }
      ];

      // Insert markets
      const { data: marketData, error: marketError } = await supabase
        .from('markets')
        .insert(testMarkets);

      if (marketError) {
        console.error('Market insert error:', marketError);
        throw marketError;
      }

      // Insert binary market pools for binary markets
      const binaryPools = [
        {
          market_id: marketUuids[0], // Bitcoin market
          yes_price: 0.65,
          no_price: 0.35,
          yes_pool: 32500,
          no_pool: 17500
        },
        {
          market_id: marketUuids[2], // Inflation market
          yes_price: 0.42,
          no_price: 0.58,
          yes_pool: 37800,
          no_pool: 52200
        },
        {
          market_id: marketUuids[3], // River Plate market
          yes_price: 0.28,
          no_price: 0.72,
          yes_pool: 9800,
          no_pool: 25200
        }
      ];

      const { data: poolData, error: poolError } = await supabase
        .from('binary_market_pools')
        .insert(binaryPools);

      if (poolError) {
        console.error('Pool insert error:', poolError);
        throw poolError;
      }

      setMessage('✅ Test markets created successfully! You can now check the main page.');
      
    } catch (error) {
      console.error('Error creating test markets:', error);
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🚀 Create Test Markets</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          This will create 5 test markets in the database to test the real data integration.
        </p>
        
        <button
          onClick={createTestMarkets}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '⏳ Creating markets...' : '🎯 Create Test Markets'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h2 className="font-semibold mb-2">📋 What this creates:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>5 test markets (3 binary, 2 multiple choice)</li>
          <li>Binary market pools with realistic pricing</li>
          <li>Categories: Tecnología, Política, Economía, Deporte</li>
          <li>Realistic volumes and participant counts</li>
        </ul>
      </div>
    </div>
  );
}
