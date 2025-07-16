"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/AuthProvider';
import { tradingService, UserProfile } from '../../lib/supabase/trading';

export interface UserPosition {
  id: string;
  market_id: string;
  market_title: string;
  market_type: 'binary' | 'multiple';
  option_id?: string;
  position_type: string;
  shares_owned: number;
  average_price: number;
  total_invested: number;
  current_value: number;
  unrealized_pnl: number;
  market_status: string;
  market_end_date: string;
  option_text?: string;
  option_color?: string;
}

export interface TradeHistory {
  id: string;
  market_id: string;
  market_title: string;
  trade_type: string;
  amount: number;
  shares: number;
  price_per_share: number;
  created_at: string;
  option_text?: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await tradingService.getUserProfile(user.id);
      
      if (result) {
        setProfile(result);
        setError(null);
      } else {
        setError('Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  };
}

export function useUserPositions() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async () => {
    if (!user) {
      setPositions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await tradingService.getUserPositions(user.id);
      
      if (result && Array.isArray(result)) {
        setPositions(result);
        setError(null);
      } else {
        setError('Failed to fetch positions');
      }
    } catch (err) {
      console.error('Error fetching user positions:', err);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [user]);

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions
  };
}

export function useTradeHistory() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    if (!user) {
      setTrades([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await tradingService.getUserTrades(user.id);
      
      if (result && Array.isArray(result)) {
        setTrades(result);
        setError(null);
      } else {
        setError('Failed to fetch trade history');
      }
    } catch (err) {
      console.error('Error fetching trade history:', err);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [user]);

  return {
    trades,
    loading,
    error,
    refetch: fetchTrades
  };
}
