import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Trading-specific schema for MarketMinds AI

export const tradingAlerts = pgTable("trading_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  symbol: text("symbol").notNull(),
  condition: text("condition").notNull(), // "above", "below", "crosses"
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  isTriggered: boolean("is_triggered").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  triggeredAt: timestamp("triggered_at"),
});

export const tradeJournal = pgTable("trade_journal", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  symbol: text("symbol").notNull(),
  action: text("action").notNull(), // "buy" or "sell"
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }).notNull(),
  exitPrice: decimal("exit_price", { precision: 10, scale: 2 }),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 2 }),
  takeProfit: decimal("take_profit", { precision: 10, scale: 2 }),
  pnl: decimal("pnl", { precision: 10, scale: 2 }),
  pnlPercent: decimal("pnl_percent", { precision: 5, scale: 2 }),
  notes: text("notes"),
  tags: text("tags").array(),
  isOpen: boolean("is_open").default(true),
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const marketSentiment = pgTable("market_sentiment", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  sentiment: text("sentiment").notNull(), // "bullish", "bearish", "neutral"
  score: integer("score").notNull(), // -100 to 100
  confidence: integer("confidence").notNull(), // 0-100
  sources: jsonb("sources"), // { news: number, social: number, technical: number }
  createdAt: timestamp("created_at").defaultNow(),
});

export const tradingSignals = pgTable("trading_signals", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  action: text("action").notNull(), // "buy" or "sell"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 2 }),
  takeProfit: decimal("take_profit", { precision: 10, scale: 2 }),
  riskReward: decimal("risk_reward", { precision: 5, scale: 2 }),
  confidence: integer("confidence").notNull(), // 1-10
  timeframe: text("timeframe").notNull(),
  reasoning: text("reasoning"),
  status: text("status").default("active"), // "active", "triggered", "expired", "cancelled"
  expiryTime: timestamp("expiry_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).default("0.00"),
  totalPnL: decimal("total_pnl", { precision: 12, scale: 2 }).default("0.00"),
  totalPnLPercent: decimal("total_pnl_percent", { precision: 5, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull(),
  symbol: text("symbol").notNull(),
  side: text("side").notNull(), // "long" or "short"
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  unrealizedPnL: decimal("unrealized_pnl", { precision: 10, scale: 2 }),
  unrealizedPnLPercent: decimal("unrealized_pnl_percent", { precision: 5, scale: 2 }),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 2 }),
  takeProfit: decimal("take_profit", { precision: 10, scale: 2 }),
  isOpen: boolean("is_open").default(true),
  openTime: timestamp("open_time").defaultNow(),
  closeTime: timestamp("close_time"),
});

export const backtestResults = pgTable("backtest_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  strategyName: text("strategy_name").notNull(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  initialCapital: decimal("initial_capital", { precision: 12, scale: 2 }).notNull(),
  finalCapital: decimal("final_capital", { precision: 12, scale: 2 }).notNull(),
  totalReturn: decimal("total_return", { precision: 12, scale: 2 }).notNull(),
  totalReturnPercent: decimal("total_return_percent", { precision: 5, scale: 2 }).notNull(),
  maxDrawdown: decimal("max_drawdown", { precision: 12, scale: 2 }).notNull(),
  maxDrawdownPercent: decimal("max_drawdown_percent", { precision: 5, scale: 2 }).notNull(),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).notNull(),
  profitFactor: decimal("profit_factor", { precision: 5, scale: 2 }),
  sharpeRatio: decimal("sharpe_ratio", { precision: 5, scale: 2 }),
  totalTrades: integer("total_trades").notNull(),
  winningTrades: integer("winning_trades").notNull(),
  losingTrades: integer("losing_trades").notNull(),
  averageWin: decimal("average_win", { precision: 10, scale: 2 }),
  averageLoss: decimal("average_loss", { precision: 10, scale: 2 }),
  largestWin: decimal("largest_win", { precision: 10, scale: 2 }),
  largestLoss: decimal("largest_loss", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id").notNull(), // For anonymous users
  messageType: text("message_type").notNull(), // "user" or "ai"
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // For file attachments, analysis results, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  defaultSymbols: text("default_symbols").array(),
  defaultTimeframes: text("default_timeframes").array(),
  riskTolerance: text("risk_tolerance").default("moderate"), // "conservative", "moderate", "aggressive"
  tradingStyle: text("trading_style"), // "scalping", "day_trading", "swing_trading", "position_trading"
  aiPersonality: text("ai_personality").default("professional"), // "professional", "educational", "aggressive", "conservative"
  theme: text("theme").default("galaxy"), // "galaxy", "dark", "blue"
  language: text("language").default("en"),
  timezone: text("timezone").default("UTC"),
  currency: text("currency").default("USD"),
  notifications: jsonb("notifications"), // Notification preferences object
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertTradingAlertSchema = createInsertSchema(tradingAlerts).omit({
  id: true,
  createdAt: true,
  triggeredAt: true,
});

export const insertTradeJournalSchema = createInsertSchema(tradeJournal).omit({
  id: true,
  openedAt: true,
  closedAt: true,
});

export const insertMarketSentimentSchema = createInsertSchema(marketSentiment).omit({
  id: true,
  createdAt: true,
});

export const insertTradingSignalSchema = createInsertSchema(tradingSignals).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPositionSchema = createInsertSchema(positions).omit({
  id: true,
  openTime: true,
  closeTime: true,
});

export const insertBacktestResultSchema = createInsertSchema(backtestResults).omit({
  id: true,
  createdAt: true,
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  updatedAt: true,
});

// Type definitions
export type TradingAlert = typeof tradingAlerts.$inferSelect;
export type InsertTradingAlert = z.infer<typeof insertTradingAlertSchema>;

export type TradeJournalEntry = typeof tradeJournal.$inferSelect;
export type InsertTradeJournal = z.infer<typeof insertTradeJournalSchema>;

export type MarketSentiment = typeof marketSentiment.$inferSelect;
export type InsertMarketSentiment = z.infer<typeof insertMarketSentimentSchema>;

export type TradingSignal = typeof tradingSignals.$inferSelect;
export type InsertTradingSignal = z.infer<typeof insertTradingSignalSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type Position = typeof positions.$inferSelect;
export type InsertPosition = z.infer<typeof insertPositionSchema>;

export type BacktestResult = typeof backtestResults.$inferSelect;
export type InsertBacktestResult = z.infer<typeof insertBacktestResultSchema>;

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
