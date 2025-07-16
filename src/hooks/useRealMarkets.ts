"use client";

import { useState, useEffect, useCallback } from 'react'
import { tradingService, Market as TradingMarket, MarketOption } from '../../lib/supabase/trading'
import { Market, BinaryMarket, MultipleChoiceMarket } from '../types/market'
import { convertToDisplayMarket } from '../utils/marketUtils'

export function useRealMarkets() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMarkets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching real markets from database...')
      const realMarkets = await tradingService.getActiveMarkets()
      
      console.log('✅ Fetched markets:', realMarkets.length)
      
      // Convert to display format
      const displayMarkets = realMarkets.map(convertToDisplayMarket)
      
      setMarkets(displayMarkets)
    } catch (err) {
      console.error('❌ Error fetching markets:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch markets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarkets()
  }, [fetchMarkets])

  return {
    markets,
    loading,
    error,
    refetch: fetchMarkets
  }
}
