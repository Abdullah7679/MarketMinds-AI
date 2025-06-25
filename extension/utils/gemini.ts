// Gemini API integration for MarketMinds AI Extension

export interface ChatContext {
  previousMessages?: Array<{ type: 'user' | 'ai'; content: string; timestamp: string }>;
  tradingContext?: boolean;
  symbol?: string;
  timeframe?: string;
}

export interface ChatResponse {
  text: string;
  timestamp: string;
}

export interface FileAnalysisResponse {
  analysis: string;
  timestamp: string;
}

export class GeminiAPI {
  private static async sendMessage(action: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action, ...data }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || 'Unknown error'));
        }
      });
    });
  }
  
  static async getChatResponse(message: string, context: ChatContext = {}): Promise<ChatResponse> {
    try {
      const response = await this.sendMessage('getChatResponse', {
        message,
        context
      });
      
      return response;
    } catch (error) {
      throw new Error(`Failed to get chat response: ${error.message}`);
    }
  }
  
  static async analyzeFile(file: File): Promise<FileAnalysisResponse> {
    try {
      // Convert file to base64
      const fileData = await this.fileToBase64(file);
      
      const response = await this.sendMessage('analyzeFile', {
        file: fileData,
        type: file.type
      });
      
      return response;
    } catch (error) {
      throw new Error(`Failed to analyze file: ${error.message}`);
    }
  }
  
  static async getMarketData(symbol: string, timeframe: string = '1h'): Promise<any> {
    try {
      const response = await this.sendMessage('getMarketData', {
        symbol,
        timeframe
      });
      
      return response;
    } catch (error) {
      throw new Error(`Failed to get market data: ${error.message}`);
    }
  }
  
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:type;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }
}

// Trading-specific AI prompts and utilities
export class TradingAnalysis {
  static generateMarketAnalysisPrompt(symbol: string, timeframe: string): string {
    return `Provide a comprehensive market analysis for ${symbol} on the ${timeframe} timeframe. Include:
    
    1. Technical Analysis:
       - Current trend direction (HTF and LTF)
       - Key support and resistance levels
       - SMC structure (BOS, CHoCH, liquidity zones)
       - ICT concepts (fair value gaps, order blocks, etc.)
    
    2. Entry and Exit Strategy:
       - Potential entry points with risk/reward ratios
       - Stop loss placement recommendations
       - Take profit targets
    
    3. Risk Management:
       - Position sizing suggestions
       - Risk percentage recommendations
       - Maximum drawdown considerations
    
    Please format your response in a clear, actionable manner suitable for trading decisions.`;
  }
  
  static generateNewsAnalysisPrompt(newsText: string, assets: string[] = []): string {
    const assetContext = assets.length > 0 ? ` Focus on potential impacts to: ${assets.join(', ')}.` : '';
    
    return `Analyze this financial news and explain its potential market impact:
    
    "${newsText}"
    
    Please provide:
    1. Summary of the key points
    2. Potential market implications (bullish/bearish/neutral)
    3. Which asset classes might be affected
    4. Short-term vs long-term impact assessment
    5. Trading opportunities or risks to consider
    
    ${assetContext}
    
    Keep the analysis concise but comprehensive for trading decisions.`;
  }
  
  static generateRiskManagementPrompt(accountSize: number, riskPercentage: number, tradeType: string): string {
    return `Calculate risk management parameters for a trading account with the following details:
    
    - Account Size: $${accountSize.toLocaleString()}
    - Risk per Trade: ${riskPercentage}%
    - Trade Type: ${tradeType}
    
    Please provide:
    1. Maximum dollar risk per trade
    2. Position sizing calculations
    3. Stop loss distance recommendations
    4. Daily/weekly risk limits
    5. Drawdown protection strategies
    6. Money management best practices for this account size
    
    Format the response as actionable trading rules.`;
  }
}
