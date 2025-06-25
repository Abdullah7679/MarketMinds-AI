import type { Express } from "express";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

// Extension-specific API routes for MarketMinds AI
export function registerExtensionRoutes(app: Express) {
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || "" 
  });

  // Chat endpoint
  app.post("/api/extension/chat", async (req, res) => {
    try {
      const chatSchema = z.object({
        message: z.string().min(1),
        context: z.object({
          previousMessages: z.array(z.object({
            type: z.enum(['user', 'ai']),
            content: z.string(),
            timestamp: z.string()
          })).optional(),
          tradingContext: z.boolean().optional(),
          symbol: z.string().optional(),
          timeframe: z.string().optional()
        }).optional()
      });

      const { message, context = {} } = chatSchema.parse(req.body);

      const systemPrompt = `You are MarketMinds AI, an expert trading assistant with deep knowledge of:
      - ICT (Inner Circle Trader) concepts and methodology
      - SMC (Smart Money Concepts) and institutional order flow
      - Multi-timeframe analysis (HTF, LTF structure)
      - Price action trading and market structure
      - Risk and money management principles
      - Fundamental and technical analysis
      - Market sentiment and news impact
      - Trading psychology and discipline
      
      Provide professional, actionable trading insights. Be concise but thorough.
      Focus on practical trading advice that can be implemented immediately.
      Always emphasize proper risk management in your responses.
      
      ${context.tradingContext ? `Current trading context: Symbol: ${context.symbol || 'N/A'}, Timeframe: ${context.timeframe || 'N/A'}` : ''}
      
      Previous conversation context: ${context.previousMessages ? JSON.stringify(context.previousMessages.slice(-3)) : 'None'}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          maxOutputTokens: 1000
        },
        contents: message
      });

      res.json({
        success: true,
        data: {
          text: response.text || "I apologize, but I couldn't generate a response. Please try again.",
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to process chat request"
      });
    }
  });

  // File analysis endpoint
  app.post("/api/extension/analyze-file", async (req, res) => {
    try {
      const fileAnalysisSchema = z.object({
        fileData: z.string(), // base64 encoded file
        fileType: z.string(),
        fileName: z.string().optional()
      });

      const { fileData, fileType, fileName } = fileAnalysisSchema.parse(req.body);

      const contents = [
        {
          inlineData: {
            data: fileData,
            mimeType: fileType
          }
        },
        `Analyze this ${fileType.includes('image') ? 'trading chart or financial image' : 'financial document'} and provide relevant trading insights.
        
        Focus on:
        1. Technical patterns and formations
        2. Support and resistance levels
        3. Trend analysis and market structure
        4. Entry and exit opportunities
        5. Risk management considerations
        6. Any SMC or ICT concepts visible
        
        Provide actionable trading information based on what you observe.`
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents
      });

      res.json({
        success: true,
        data: {
          analysis: response.text || "Unable to analyze the file.",
          fileName: fileName || "uploaded_file",
          fileType: fileType,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("File analysis error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to analyze file"
      });
    }
  });

  // Market data endpoint (placeholder for real API integration)
  app.post("/api/extension/market-data", async (req, res) => {
    try {
      const marketDataSchema = z.object({
        symbol: z.string().min(1),
        timeframe: z.string().default("1h")
      });

      const { symbol, timeframe } = marketDataSchema.parse(req.body);

      // This is a placeholder - in production, you'd integrate with real market data APIs
      // such as Alpha Vantage, Yahoo Finance, Binance API, etc.
      
      const mockAnalysis = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide a brief market analysis for ${symbol} on the ${timeframe} timeframe. 
        Include current market sentiment, key levels to watch, and potential trading opportunities.
        Keep it concise and actionable for traders.`
      });

      res.json({
        success: true,
        data: {
          symbol: symbol,
          timeframe: timeframe,
          analysis: mockAnalysis.text || `Analysis for ${symbol} (${timeframe}) is currently unavailable.`,
          timestamp: new Date().toISOString(),
          note: "Market data integration requires additional API setup. Please configure your preferred data provider."
        }
      });
    } catch (error) {
      console.error("Market data error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get market data"
      });
    }
  });

  // News analysis endpoint
  app.post("/api/extension/analyze-news", async (req, res) => {
    try {
      const newsAnalysisSchema = z.object({
        newsText: z.string().min(1),
        symbols: z.array(z.string()).optional()
      });

      const { newsText, symbols = [] } = newsAnalysisSchema.parse(req.body);

      const symbolContext = symbols.length > 0 ? 
        ` Focus on potential impacts to these assets: ${symbols.join(', ')}.` : '';

      const prompt = `Analyze this financial news and explain its potential market impact:

      "${newsText}"
      
      Please provide:
      1. Summary of the key points
      2. Potential market implications (bullish/bearish/neutral)
      3. Which asset classes might be affected
      4. Short-term vs long-term impact assessment
      5. Trading opportunities or risks to consider
      
      ${symbolContext}
      
      Keep the analysis concise but comprehensive for trading decisions.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt
      });

      res.json({
        success: true,
        data: {
          analysis: response.text || "Unable to analyze the news.",
          symbols: symbols,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("News analysis error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to analyze news"
      });
    }
  });

  // Risk management calculator endpoint
  app.post("/api/extension/risk-management", async (req, res) => {
    try {
      const riskManagementSchema = z.object({
        accountSize: z.number().positive(),
        riskPercentage: z.number().min(0.1).max(10),
        tradeType: z.string(),
        entryPrice: z.number().positive().optional(),
        stopLoss: z.number().positive().optional()
      });

      const { accountSize, riskPercentage, tradeType, entryPrice, stopLoss } = 
        riskManagementSchema.parse(req.body);

      const riskAmount = (accountSize * riskPercentage) / 100;
      
      let positionSize = 0;
      let stopLossDistance = 0;
      
      if (entryPrice && stopLoss) {
        stopLossDistance = Math.abs(entryPrice - stopLoss);
        positionSize = riskAmount / stopLossDistance;
      }

      const prompt = `Calculate and explain risk management parameters for a trading account:
      
      - Account Size: $${accountSize.toLocaleString()}
      - Risk per Trade: ${riskPercentage}%
      - Maximum Dollar Risk: $${riskAmount.toFixed(2)}
      - Trade Type: ${tradeType}
      ${entryPrice ? `- Entry Price: $${entryPrice}` : ''}
      ${stopLoss ? `- Stop Loss: $${stopLoss}` : ''}
      ${positionSize > 0 ? `- Calculated Position Size: ${positionSize.toFixed(4)} units` : ''}
      
      Provide comprehensive risk management guidance including:
      1. Position sizing recommendations
      2. Daily/weekly risk limits
      3. Drawdown protection strategies
      4. Money management best practices for this account size
      5. Risk/reward ratio recommendations
      
      Format the response as actionable trading rules.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt
      });

      res.json({
        success: true,
        data: {
          accountSize,
          riskPercentage,
          maxRiskAmount: riskAmount,
          positionSize: positionSize > 0 ? positionSize : null,
          stopLossDistance: stopLossDistance > 0 ? stopLossDistance : null,
          guidance: response.text || "Risk management calculation completed.",
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Risk management error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to calculate risk management"
      });
    }
  });

  // Trading education endpoint
  app.post("/api/extension/education", async (req, res) => {
    try {
      const educationSchema = z.object({
        topic: z.string().min(1),
        level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate')
      });

      const { topic, level } = educationSchema.parse(req.body);

      const prompt = `Provide an educational explanation about "${topic}" for ${level} level traders.
      
      Structure your response with:
      1. Clear definition and key concepts
      2. Practical examples and applications
      3. Step-by-step implementation guide
      4. Common mistakes to avoid
      5. Advanced tips (if applicable)
      
      Focus on actionable knowledge that can be applied in real trading scenarios.
      Use simple language but maintain technical accuracy.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt
      });

      res.json({
        success: true,
        data: {
          topic,
          level,
          content: response.text || `Educational content for ${topic} is currently being prepared.`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Education error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get educational content"
      });
    }
  });
}
