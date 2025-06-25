# MarketMinds AI - Trading Assistant Extension

## Overview

MarketMinds AI is a comprehensive trading assistant system that combines a Chrome browser extension with a full-stack web application. The project provides AI-powered trading insights, real-time market analysis, and professional trading tools through an intelligent conversational interface powered by Google's Gemini AI.

## System Architecture

### Hybrid Architecture Pattern
The system follows a dual-architecture approach:
- **Browser Extension**: Provides ubiquitous access to trading insights across all web pages
- **Web Application**: Serves as a comprehensive trading platform with advanced features
- **Shared Backend**: Common API layer serving both the extension and web app

### Technology Stack
- **Frontend**: React 18 with TypeScript, Tailwind CSS, Radix UI components
- **Backend**: Express.js with TypeScript, PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini AI for conversational trading assistance
- **Extension**: Chrome Extension Manifest V3 with React integration
- **Build Tools**: Vite for web app, Webpack for extension bundling

## Key Components

### 1. Chrome Extension Architecture
- **Background Service Worker**: Handles AI requests and extension lifecycle
- **Content Script**: Injects floating widget into web pages
- **Popup Interface**: Settings and configuration management
- **React Integration**: Full React component system within extension context

### 2. AI-Powered Chat System
- **Gemini Integration**: Professional trading assistant with ICT/SMC expertise
- **Context Awareness**: Maintains conversation history and trading context
- **Multi-modal Support**: Text, voice, and file analysis capabilities
- **Real-time Responses**: Streaming AI responses for immediate feedback

### 3. Trading Feature Suite
- **Trade Journal**: Performance tracking and analysis
- **Price Alerts**: Custom notification system
- **Market Sentiment**: AI-driven sentiment analysis
- **Economic Calendar**: Event tracking and impact analysis
- **Strategy Backtesting**: Historical performance validation

### 4. Database Schema
- **User Management**: Authentication and preferences
- **Trading Data**: Alerts, journal entries, and market sentiment
- **AI Interactions**: Chat history and context preservation

## Data Flow

### Extension-to-Backend Communication
1. User interacts with floating widget
2. Content script sends message to background worker
3. Background worker processes AI requests via Gemini API
4. Responses stream back through message passing system
5. UI updates in real-time with trading insights

### Web Application Flow
1. Traditional React SPA with server-side API
2. Real-time market data integration
3. Database persistence for user preferences and trading data
4. Shared authentication with extension context

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary conversational AI engine
- **Trading Expertise**: Specialized in ICT (Inner Circle Trader) and SMC (Smart Money Concepts)

### Database
- **PostgreSQL**: Primary data store with Drizzle ORM
- **Schema**: User management, trading alerts, journal entries, market sentiment

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Pre-built component library

## Deployment Strategy

### Development Environment
- **Replit Integration**: Cloud-based development with hot reloading
- **Vite Dev Server**: Fast development builds for web app
- **Webpack Dev Mode**: Extension development with React support

### Production Deployment
- **Web App**: Static build deployment via Vite
- **Extension**: Chrome Web Store distribution
- **Database**: PostgreSQL with connection pooling
- **Environment Variables**: Secure API key management

### Extension Distribution
- **Manifest V3**: Modern Chrome extension architecture
- **Permissions**: Minimal required permissions for security
- **Web Accessible Resources**: Proper resource isolation

## Changelog

- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.