// User and portfolio related types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  avatarUrl?: string;
  joinedAt: string;
  createdAt: string;
  lastActiveAt: string;
  balance: number;
  totalVolume: number;
  winRate: number;
  totalProfitLoss: number;
  totalProfit: number;
  portfolioValue: number;
  totalTrades: number;
  currentStreak: number;
  level: number;
  experience: number;
}

export interface UserPosition {
  id: string;
  marketId: number;
  marketTitle: string;
  marketType: 'binary' | 'multiple';
  outcome: string; // 'yes'/'no' for binary, optionId for multiple
  outcomeText: string; // Display text
  shares: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  purchaseDate: string;
  marketEndDate: string;
  marketStatus: 'active' | 'closed' | 'resolved';
}

export interface UserTrade {
  id: string;
  marketId: number;
  marketTitle: string;
  marketType: 'binary' | 'multiple';
  type: 'buy' | 'sell';
  outcome: string;
  outcomeText: string;
  shares: number;
  price: number;
  totalAmount: number;
  timestamp: string;
  fees: number;
}

export interface UserStats {
  totalTrades: number;
  totalVolume: number;
  totalProfit: number;
  winRate: number;
  activePositions: number;
  marketsTraded: number;
  averageHoldTime: number; // in days
  biggestWin: number;
  biggestLoss: number;
  currentStreak: number;
  bestStreak: number;
}

export interface WatchlistItem {
  marketId: number;
  marketTitle: string;
  marketType: 'binary' | 'multiple';
  addedAt: string;
  currentPrice?: number;
  priceChange24h?: number;
}
