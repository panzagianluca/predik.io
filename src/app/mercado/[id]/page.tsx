import { notFound } from 'next/navigation';
import { MarketDetails } from '@/components/market-details';
import { Market } from '@/types/market';
import { tradingService } from '../../../../lib/supabase/trading';
import { convertToDisplayMarket } from '@/utils/marketUtils';

// Fetch real market data from database
async function getMarket(id: string): Promise<Market | null> {
  try {
    console.log('getMarket called with ID:', id);
    
    // First try to get market directly by the ID (should work for TEXT IDs like 'market-1')
    let marketData = await tradingService.getMarketDetails(id);
    
    if (!marketData) {
      console.log('Market not found by direct ID, trying fallback methods');
      
      // Fallback: Get all markets and try to find a match
      const allMarkets = await tradingService.getActiveMarkets();
      console.log('Found', allMarkets.length, 'active markets');
      
      // Try to find by exact ID match first
      let foundMarket = allMarkets.find(m => m.id === id);
      
      // If still not found, try numeric ID matching (for backward compatibility)
      if (!foundMarket && /^\d+$/.test(id)) {
        // If the ID is purely numeric, try to find by converted display ID
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
