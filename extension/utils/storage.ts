// Extension storage utilities for MarketMinds AI

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

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
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

const DEFAULT_SETTINGS: ExtensionSettings = {
  isEnabled: true,
  position: { x: window.innerWidth - 80, y: window.innerHeight - 80 },
  aiPersonality: 'professional',
  notifications: true,
  theme: 'galaxy',
  autoSaveChats: true,
  maxChatHistory: 100
};

export class ExtensionStorage {
  // Settings management
  static async getSettings(): Promise<ExtensionSettings> {
    try {
      const result = await chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS));
      return { ...DEFAULT_SETTINGS, ...result };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return DEFAULT_SETTINGS;
    }
  }
  
  static async updateSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    try {
      await chrome.storage.sync.set(settings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }
  
  // Generic storage methods
  static async get(keys: string | string[]): Promise<any> {
    try {
      return await chrome.storage.sync.get(keys);
    } catch (error) {
      console.error('Storage get error:', error);
      return {};
    }
  }
  
  static async set(items: Record<string, any>): Promise<void> {
    try {
      await chrome.storage.sync.set(items);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }
  
  static async remove(keys: string | string[]): Promise<void> {
    try {
      await chrome.storage.sync.remove(keys);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
  
  // Chat history management
  static async getChatHistory(): Promise<ChatMessage[]> {
    try {
      const result = await chrome.storage.local.get(['chatHistory']);
      return result.chatHistory || [];
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return [];
    }
  }
  
  static async saveChatHistory(messages: ChatMessage[]): Promise<void> {
    try {
      const settings = await this.getSettings();
      const limitedMessages = messages.slice(-settings.maxChatHistory);
      await chrome.storage.local.set({ chatHistory: limitedMessages });
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }
  
  static async clearChatHistory(): Promise<void> {
    try {
      await chrome.storage.local.remove(['chatHistory']);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }
  
  // Trading alerts management
  static async getAlerts(): Promise<TradingAlert[]> {
    try {
      const result = await chrome.storage.local.get(['tradingAlerts']);
      return result.tradingAlerts || [];
    } catch (error) {
      console.error('Failed to get alerts:', error);
      return [];
    }
  }
  
  static async saveAlert(alert: TradingAlert): Promise<void> {
    try {
      const alerts = await this.getAlerts();
      const updatedAlerts = [...alerts.filter(a => a.id !== alert.id), alert];
      await chrome.storage.local.set({ tradingAlerts: updatedAlerts });
    } catch (error) {
      console.error('Failed to save alert:', error);
    }
  }
  
  static async removeAlert(alertId: string): Promise<void> {
    try {
      const alerts = await this.getAlerts();
      const updatedAlerts = alerts.filter(a => a.id !== alertId);
      await chrome.storage.local.set({ tradingAlerts: updatedAlerts });
    } catch (error) {
      console.error('Failed to remove alert:', error);
    }
  }
  
  // Trade journal management
  static async getTradeJournal(): Promise<TradeJournalEntry[]> {
    try {
      const result = await chrome.storage.local.get(['tradeJournal']);
      return result.tradeJournal || [];
    } catch (error) {
      console.error('Failed to get trade journal:', error);
      return [];
    }
  }
  
  static async saveTradeEntry(entry: TradeJournalEntry): Promise<void> {
    try {
      const journal = await this.getTradeJournal();
      const updatedJournal = [...journal.filter(t => t.id !== entry.id), entry];
      await chrome.storage.local.set({ tradeJournal: updatedJournal });
    } catch (error) {
      console.error('Failed to save trade entry:', error);
    }
  }
  
  static async removeTradeEntry(entryId: string): Promise<void> {
    try {
      const journal = await this.getTradeJournal();
      const updatedJournal = journal.filter(t => t.id !== entryId);
      await chrome.storage.local.set({ tradeJournal: updatedJournal });
    } catch (error) {
      console.error('Failed to remove trade entry:', error);
    }
  }
  
  // Performance analytics
  static async getPerformanceStats(): Promise<any> {
    try {
      const journal = await this.getTradeJournal();
      const closedTrades = journal.filter(t => !t.isOpen && t.pnl !== undefined);
      
      if (closedTrades.length === 0) {
        return {
          totalTrades: 0,
          winRate: 0,
          totalPnL: 0,
          averageWin: 0,
          averageLoss: 0,
          profitFactor: 0,
          maxDrawdown: 0
        };
      }
      
      const wins = closedTrades.filter(t => t.pnl! > 0);
      const losses = closedTrades.filter(t => t.pnl! < 0);
      
      const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const totalWins = wins.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const totalLosses = Math.abs(losses.reduce((sum, t) => sum + (t.pnl || 0), 0));
      
      return {
        totalTrades: closedTrades.length,
        winRate: (wins.length / closedTrades.length) * 100,
        totalPnL,
        averageWin: wins.length > 0 ? totalWins / wins.length : 0,
        averageLoss: losses.length > 0 ? totalLosses / losses.length : 0,
        profitFactor: totalLosses > 0 ? totalWins / totalLosses : 0,
        maxDrawdown: this.calculateMaxDrawdown(closedTrades)
      };
    } catch (error) {
      console.error('Failed to get performance stats:', error);
      return null;
    }
  }
  
  private static calculateMaxDrawdown(trades: TradeJournalEntry[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;
    
    for (const trade of trades.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())) {
      runningPnL += trade.pnl || 0;
      
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown;
  }
}

// Storage event listeners
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('Storage changed:', changes, namespace);
  
  // Handle settings changes
  if (changes.isEnabled) {
    // Toggle widget visibility
    window.postMessage({
      type: 'MARKETMINDS_SETTINGS_CHANGED',
      setting: 'isEnabled',
      value: changes.isEnabled.newValue
    }, '*');
  }
  
  if (changes.position) {
    // Update widget position
    window.postMessage({
      type: 'MARKETMINDS_SETTINGS_CHANGED',
      setting: 'position',
      value: changes.position.newValue
    }, '*');
  }
});
