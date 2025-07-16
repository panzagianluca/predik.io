"use client";

import { useEffect, useState } from 'react';
import { tradingService, Market } from '../../../lib/supabase/trading';

export default function TestDataPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔄 Testing database connection...');
        const data = await tradingService.getActiveMarkets();
        console.log('✅ Markets fetched:', data);
        setMarkets(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Test Database Connection</h1>
      
      {loading && (
        <div className="text-blue-600">⏳ Loading markets from database...</div>
      )}
      
      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded">
          ❌ Error: {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            📊 Found {markets.length} markets in database
          </h2>
          
          {markets.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded">
              📝 No markets found. Database is empty.
              <br />
              <br />
              <strong>Next steps:</strong>
              <ol className="list-decimal list-inside mt-2">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to SQL Editor</li>
                <li>Run the SQL script from create-test-markets.sql</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              {markets.map((market, index) => (
                <div key={market.id} className="border p-4 rounded">
                  <h3 className="font-semibold">{market.title}</h3>
                  <p className="text-sm text-gray-600">{market.description}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>Category: {market.category}</span>
                    <span>Type: {market.type}</span>
                    <span>Volume: ${market.total_volume?.toLocaleString()}</span>
                    <span>Participants: {market.participant_count}</span>
                  </div>
                  {market.type === 'binary' && (
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-green-600">YES: {market.yes_price?.toFixed(2) || '0.50'}</span>
                      <span className="text-red-600">NO: {market.no_price?.toFixed(2) || '0.50'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
