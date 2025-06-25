// Type definitions for MarketMinds AI Extension

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  metadata?: {
    fileType?: string;
    fileName?: string;
    analysis?: string;
  };
}

export interface ChatHistory {
  messages: ChatMessage[];
  lastUpdated: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  high24h?: number;
  low24h?: number;
  marketCap?: number;
}

export interface TechnicalAnalysis {
  symbol: string;
  timeframe: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 1-10
  indicators: {
    rsi?: number;
    macd?: {
      signal: number;
      histogram: number;
      macd: number;
    };
    movingAverages?: {
      sma20?: number;
      sma50?: number;
      sma200?: number;
      ema20?: number;
      ema50?: number;
    };
  };
  supportLevels: number[];
  resistanceLevels: number[];
  keyLevels: {
    level: number;
    type: 'support' | 'resistance' | 'pivot';
    strength: number;
  }[];
  smcAnalysis?: {
    structure: 'bullish' | 'bearish' | 'ranging';
    bos: boolean; // Break of Structure
    choch: boolean; // Change of Character
    liquidity: {
      level: number;
      type: 'buy' | 'sell';
      swept: boolean;
    }[];
    orderBlocks: {
      level: number;
      type: 'bullish' | 'bearish';
      timeframe: string;
    }[];
    fairValueGaps: {
      high: number;
      low: number;
      type: 'bullish' | 'bearish';
      filled: boolean;
    }[];
  };
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevantSymbols: string[];
  impact: 'low' | 'medium' | 'high';
  category: 'economic' | 'political' | 'corporate' | 'technical';
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  date: string;
  time: string;
  impact: 'low' | 'medium' | 'high';
  forecast?: string;
  previous?: string;
  actual?: string;
  currency: string;
  description: string;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  riskReward?: number;
  confidence: number; // 1-10
  timeframe: string;
  reasoning: string;
  expiryTime?: string;
  status: 'active' | 'triggered' | 'expired' | 'cancelled';
  createdAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  positions: Position[];
  lastUpdated: string;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  stopLoss?: number;
  takeProfit?: number;
  openTime: string;
}

export interface BacktestResult {
  id: string;
  strategy: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalReturnPercent: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  trades: BacktestTrade[];
  createdAt: string;
}

export interface BacktestTrade {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  commission: number;
  reason: 'stop_loss' | 'take_profit' | 'signal_exit' | 'end_of_test';
}

export interface MarketSentiment {
  symbol: string;
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number; // -100 to 100
  sources: {
    news: number;
    social: number;
    technical: number;
    fundamental: number;
  };
  confidence: number; // 0-100
  timestamp: string;
}

export interface UserPreferences {
  defaultSymbols: string[];
  defaultTimeframes: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  tradingStyle: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading';
  notificationSettings: {
    priceAlerts: boolean;
    newsAlerts: boolean;
    signalAlerts: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  displaySettings: {
    theme: 'galaxy' | 'dark' | 'blue';
    language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
    timezone: string;
    currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD';
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface WebSocketMessage {
  type: 'price_update' | 'news_update' | 'signal_update' | 'alert_triggered';
  data: any;
  timestamp: string;
}

// Event types for extension messaging
export type ExtensionMessage = 
  | { type: 'GET_CHAT_RESPONSE'; payload: { message: string; context?: any } }
  | { type: 'ANALYZE_FILE'; payload: { file: File } }
  | { type: 'GET_MARKET_DATA'; payload: { symbol: string; timeframe?: string } }
  | { type: 'GET_TECHNICAL_ANALYSIS'; payload: { symbol: string; timeframe: string } }
  | { type: 'GET_NEWS'; payload: { symbols?: string[]; limit?: number } }
  | { type: 'CREATE_ALERT'; payload: TradingAlert }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ExtensionSettings> }
  | { type: 'SAVE_TRADE'; payload: TradeJournalEntry };

export interface ExtensionSettings {
  isEnabled: boolean;
  position: { x: number; y: number };
  aiPersonality: 'professional' | 'educational' | 'aggressive' | 'conservative';
  notifications: boolean;
  geminiApiKey?: string;
  theme: 'galaxy' | 'dark' | 'blue';
  autoSaveChats: boolean;
  maxChatHistory: number;
}

export interface TradingAlert {
  id: string;
  symbol: string;
  condition: string;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface TradeJournalEntry {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  notes: string;
  tags: string[];
  timestamp: string;
  isOpen: boolean;
  pnl?: number;
}
