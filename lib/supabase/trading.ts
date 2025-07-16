// Trading utilities for Predik.io
import { createClient } from './client'

export interface TradeResult {
  success: boolean
  error?: string
  trade_id?: string
  shares_bought?: number
  price_per_share?: number
}

export interface UserProfile {
  id: string
  full_name: string
  username: string
  balance: number
  total_volume: number
  markets_won: number
  markets_traded: number
  total_profit_loss: number
  win_rate: number
  is_admin: boolean
}

export interface MarketOption {
  id: string
  market_id: string
  option_text: string
  current_price: number
  pool_amount: number
  share_count: number
  option_color: string // Updated to match database schema
  is_winning_option?: boolean
  created_at?: string
  updated_at?: string
}

export interface PriceHistoryPoint {
  id: string
  market_id: string
  option_id?: string
  price_type: 'yes' | 'no' | 'option'
  price: number
  volume_24h: number
  timestamp: string
}

export interface Market {
  id: string
  title: string
  description: string
  category: string
  type: 'binary' | 'multiple'
  status: 'active' | 'closed' | 'resolved' | 'cancelled'
  end_date: string
  total_volume: number
  participant_count: number
  yes_price?: number
  no_price?: number
  options?: MarketOption[]
}

export class TradingService {
  private supabase = createClient()

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  }

  // Get all active markets with options for multiple choice
  async getActiveMarkets(): Promise<Market[]> {
    const { data: markets, error } = await this.supabase
      .from('markets')
      .select(`
        *,
        binary_market_pools(yes_price, no_price),
        market_options(*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching markets:', error)
      return []
    }

    return markets.map(market => ({
      ...market,
      yes_price: market.binary_market_pools?.[0]?.yes_price || 0.5,
      no_price: market.binary_market_pools?.[0]?.no_price || 0.5,
      options: market.market_options || []
    }))
  }

  // Execute a binary trade
  async executeBinaryTrade(
    marketId: string,
    userId: string,
    tradeType: 'buy_yes' | 'buy_no',
    amount: number
  ): Promise<TradeResult> {
    const { data, error } = await this.supabase
      .rpc('execute_binary_trade', {
        p_market_id: marketId,
        p_user_id: userId,
        p_trade_type: tradeType,
        p_amount: amount
      })

    if (error) {
      console.error('Error executing trade:', error)
      return { success: false, error: error.message }
    }

    return data
  }

  // Execute a multiple choice option trade
  async executeOptionTrade(
    marketId: string,
    userId: string,
    optionId: string,
    tradeType: 'buy_option' | 'sell_option',
    amount: number
  ): Promise<TradeResult> {
    const { data, error } = await this.supabase
      .rpc('execute_option_trade', {
        p_market_id: marketId,
        p_user_id: userId,
        p_option_id: optionId,
        p_trade_type: tradeType,
        p_amount: amount
      })

    if (error) {
      console.error('Error executing option trade:', error)
      return { success: false, error: error.message }
    }

    return data
  }

  // Get user positions for a market
  async getUserPositions(userId: string, marketId?: string) {
    let query = this.supabase
      .from('user_positions')
      .select(`
        *,
        markets(title, status, type)
      `)
      .eq('user_id', userId)

    if (marketId) {
      query = query.eq('market_id', marketId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching positions:', error)
      return []
    }

    return data
  }

  // Get trade history for a user
  async getUserTrades(userId: string, limit: number = 50) {
    const { data, error } = await this.supabase
      .from('trades')
      .select(`
        *,
        markets(title, type)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching trades:', error)
      return []
    }

    return data
  }

  // Get market details with current prices and options
  async getMarketDetails(marketId: string) {
    console.log('Fetching market details for ID:', marketId);
    
    // First, let's try without market_comments to see if it exists
    const { data: market, error: marketError } = await this.supabase
      .from('markets')
      .select(`
        *,
        binary_market_pools(*),
        market_options(*)
      `)
      .eq('id', marketId)
      .single()

    if (marketError) {
      // Only log detailed errors for non-routine cases (not just "no rows returned")
      if (marketError.code !== 'PGRST116') {
        console.error('Error fetching market details:', {
          error: marketError,
          message: marketError.message,
          code: marketError.code,
          details: marketError.details,
          hint: marketError.hint,
          marketId: marketId
        })
      } else {
        console.log('Market not found with ID:', marketId, '(will try fallback if needed)')
      }
      return null
    }

    console.log('Successfully fetched market:', market?.title || 'Unknown');

    // Sort options by display order
    if (market.market_options) {
      market.options = market.market_options
    }

    return market
  }

  // Resolve a market (admin only)
  async resolveMarket(
    marketId: string,
    adminId: string,
    outcome: 'yes' | 'no' | string // For multiple choice, outcome can be option ID
  ) {
    // Check market type to determine which function to call
    const { data: market } = await this.supabase
      .from('markets')
      .select('type')
      .eq('id', marketId)
      .single()

    if (market?.type === 'multiple') {
      // For multiple choice, outcome should be the winning option ID
      const { data, error } = await this.supabase
        .rpc('resolve_option_market', {
          p_market_id: marketId,
          p_winning_option_id: outcome,
          p_admin_id: adminId
        })

      if (error) {
        console.error('Error resolving option market:', error)
        return { success: false, error: error.message }
      }

      return data
    } else {
      // Binary market resolution
      const { data, error } = await this.supabase
        .rpc('resolve_binary_market', {
          p_market_id: marketId,
          p_admin_id: adminId,
          p_outcome: outcome
        })

      if (error) {
        console.error('Error resolving binary market:', error)
        return { success: false, error: error.message }
      }

      return data
    }
  }

  // Create user profile manually (for debugging)
  async createUserProfile(
    userId: string,
    fullName: string,
    username: string,
    avatarUrl: string | null = null,
    authProvider: string = 'google'
  ) {
    const { data, error } = await this.supabase
      .rpc('create_user_profile', {
        p_user_id: userId,
        p_full_name: fullName,
        p_username: username,
        p_avatar_url: avatarUrl,
        p_auth_provider: authProvider
      })

    return { data, error }
  }

  // Check if user exists in users_profile table
  async checkUserInDatabase(userId: string) {
    const { data, error } = await this.supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  }

  // Get price history for market charts
  async getPriceHistory(marketId: string, optionId?: string, hours: number = 24) {
    try {
      let query = this.supabase
        .from('market_price_history')
        .select('*')
        .eq('market_id', marketId)
        .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: true })

      if (optionId) {
        query = query.eq('option_id', optionId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching price history:', error)
        return { data: [], error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Unexpected error fetching price history:', error)
      return { data: [], error }
    }
  }
}

// Export singleton instance
export const tradingService = new TradingService()
