import { Market as TradingMarket, MarketOption } from '../../lib/supabase/trading'
import { Market, BinaryMarket, MultipleChoiceMarket } from '../types/market'

// Convert real market to display format
export function convertToDisplayMarket(realMarket: TradingMarket): Market {
  // Extract numeric ID from TEXT ID like 'market-1' -> 1, or generate random for other formats
  let displayId: number;
  const idParts = realMarket.id.split('-');
  
  if (idParts.length >= 2 && idParts[0] === 'market') {
    // Handle 'market-1', 'market-2', etc.
    displayId = parseInt(idParts[1]) || Math.floor(Math.random() * 1000);
  } else if (/^\d+$/.test(realMarket.id)) {
    // Handle pure numeric IDs
    displayId = parseInt(realMarket.id);
  } else {
    // Fallback for UUIDs or other formats
    displayId = Math.floor(Math.random() * 1000);
  }

  const baseMarket = {
    id: displayId,
    uuid: realMarket.id, // Preserve original ID for database operations
    title: realMarket.title,
    category: realMarket.category,
    description: realMarket.description,
    volume: realMarket.total_volume,
    endDate: realMarket.end_date,
    participants: realMarket.participant_count,
    createdAt: new Date().toISOString(),
    status: realMarket.status as 'active' | 'closed' | 'resolved'
  }

  if (realMarket.type === 'binary') {
    return {
      ...baseMarket,
      type: 'binary',
      yesPrice: realMarket.yes_price || 0.5,
      noPrice: realMarket.no_price || 0.5
    } as BinaryMarket
  } else {
    return {
      ...baseMarket,
      type: 'multiple',
      options: (realMarket.options || []).map((option: MarketOption, index: number) => ({
        id: option.id,
        text: option.option_text,
        price: option.current_price,
        color: option.option_color, // Fixed: use option_color to match database schema
        shares: option.share_count || 0
      }))
    } as MultipleChoiceMarket
  }
}
