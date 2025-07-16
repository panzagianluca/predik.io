import { notFound } from 'next/navigation';
import { MarketDetails } from '@/components/market-details';
import { Market } from '@/types/market';
import { tradingService } from '../../../../lib/supabase/trading';
import { convertToDisplayMarket } from '@/utils/marketUtils';

// Fetch real market data from database
async function getMarket(id: string): Promise<Market | null> {
  try {
    console.log('getMarket called with ID:', id);
    
    // If the ID is numeric, convert it to the proper format first
    let marketId = id;
    if (/^\d+$/.test(id)) {
      marketId = `market-${id}`;
      console.log('Converted numeric ID to:', marketId);
    }
    
    // Try to get market with the proper ID format
    let marketData = await tradingService.getMarketDetails(marketId);
    
    if (!marketData) {
      console.log('Market not found with ID:', marketId, 'trying fallback methods');
      
      // Fallback: Get all markets and try to find a match
      const allMarkets = await tradingService.getActiveMarkets();
      console.log('Found', allMarkets.length, 'active markets');
      
      // Try to find by exact ID match first
      let foundMarket = allMarkets.find(m => m.id === id || m.id === marketId);
      
      // If still not found and original ID was numeric, try other variations
      if (!foundMarket && /^\d+$/.test(id)) {
        // Try to find by converted display ID
        foundMarket = allMarkets.find(m => {
          const idParts = m.id.split('-');
          if (idParts.length >= 2 && idParts[0] === 'market') {
            return idParts[1] === id;
          }
          return false;
        });
      }
      
      if (foundMarket) {
        console.log('Found market via fallback:', foundMarket.title);
        marketData = await tradingService.getMarketDetails(foundMarket.id);
      } else {
        console.log('No market found with ID:', id);
        return null;
      }
    }
    
    if (!marketData) {
      return null;
    }
    
    // Convert to display format
    const displayMarket = convertToDisplayMarket(marketData);
    return displayMarket;
    
  } catch (error) {
    console.error('Error fetching market:', error);
    return null;
  }
}

export default async function MarketPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const market = await getMarket(id);
  
  if (!market) {
    notFound();
  }

  return <MarketDetails market={market} />;
}
