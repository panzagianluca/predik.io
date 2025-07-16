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

  // Get all active markets
  async getActiveMarkets(): Promise<Market[]> {
    const { data: markets, error } = await this.supabase
      .from('markets')
      .select(`
        *,
        binary_market_pools(yes_price, no_price)
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
      no_price: market.binary_market_pools?.[0]?.no_price || 0.5
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

  // Get market details with current prices
  async getMarketDetails(marketId: string) {
    const { data: market, error: marketError } = await this.supabase
      .from('markets')
      .select(`
        *,
        binary_market_pools(*),
        market_comments(
          *,
          users_profile(username, avatar_url)
        )
      `)
      .eq('id', marketId)
      .single()

    if (marketError) {
      console.error('Error fetching market details:', marketError)
      return null
    }

    return market
  }

  // Resolve a market (admin only)
  async resolveMarket(
    marketId: string,
    adminId: string,
    outcome: 'yes' | 'no'
  ) {
    const { data, error } = await this.supabase
      .rpc('resolve_binary_market', {
        p_market_id: marketId,
        p_admin_id: adminId,
        p_outcome: outcome
      })

    if (error) {
      console.error('Error resolving market:', error)
      return { success: false, error: error.message }
    }

    return data
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
}

// Export singleton instance
export const tradingService = new TradingService()
