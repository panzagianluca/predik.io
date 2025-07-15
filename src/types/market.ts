// Types for different market types
export interface BaseMarket {
  id: number;
  title: string;
  category: string;
  description: string;
  volume: number;
  endDate: string;
  participants: number;
  createdAt: string;
  status: 'active' | 'closed' | 'resolved';
}

export interface BinaryMarket extends BaseMarket {
  type: 'binary';
  yesPrice: number;
  noPrice: number;
  resolved?: {
    outcome: 'yes' | 'no';
    resolvedAt: string;
  };
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  price: number;
  color: string;
}

export interface MultipleChoiceMarket extends BaseMarket {
  type: 'multiple';
  options: MultipleChoiceOption[];
  resolved?: {
    winningOption: string;
    resolvedAt: string;
  };
}

export type Market = BinaryMarket | MultipleChoiceMarket;

export interface Trade {
  id: string;
  marketId: number;
  userId: string;
  type: 'buy' | 'sell';
  outcome: string; // 'yes'/'no' for binary, optionId for multiple
  shares: number;
  price: number;
  timestamp: string;
}

export interface UserPosition {
  marketId: number;
  outcome: string;
  shares: number;
  averagePrice: number;
  currentValue: number;
  profitLoss: number;
}
