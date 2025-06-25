// Background service worker for MarketMinds AI Extension
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: "AIzaSyDJ8WLBa-HylYRMU8FnrSCxbqNZsWCOj-E"
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('MarketMinds AI Extension installed');
  
  // Initialize default settings
  chrome.storage.sync.set({
    isEnabled: true,
    theme: 'galaxy',
    position: { x: window.innerWidth - 80, y: window.innerHeight - 80 },
    aiPersonality: 'professional',
    notifications: true
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getChatResponse') {
    handleChatRequest(request.message, request.context)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'analyzeFile') {
    handleFileAnalysis(request.file, request.type)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'getMarketData') {
    handleMarketDataRequest(request.symbol, request.timeframe)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleChatRequest(message, context = {}) {
  try {
    const systemPrompt = `You are MarketMinds AI, an expert trading assistant with deep knowledge of:
    - ICT (Inner Circle Trader) concepts
    - SMC (Smart Money Concepts)
    - Price action analysis
    - Multi-timeframe analysis
    - Risk and money management
    - Fundamental and technical analysis
    - Market sentiment and news impact
    
    Provide professional, actionable trading insights. Be concise but thorough.
    Current context: ${JSON.stringify(context)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1000
      },
      contents: message
    });

    return {
      text: response.text || "I apologize, but I couldn't generate a response. Please try again.",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Chat request failed: ${error.message}`);
  }
}

async function handleFileAnalysis(fileData, fileType) {
  try {
    const contents = [
      {
        inlineData: {
          data: fileData,
          mimeType: fileType
        }
      },
      `Analyze this ${fileType.includes('image') ? 'trading chart or financial image' : 'file'} and provide relevant trading insights. 
      Focus on technical patterns, support/resistance levels, trend analysis, and any actionable trading information.`
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents
    });

    return {
      analysis: response.text || "Unable to analyze the file.",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`File analysis failed: ${error.message}`);
  }
}

async function handleMarketDataRequest(symbol, timeframe) {
  // This would integrate with real market data APIs
  // For now, return a structured response that the frontend can handle
  return {
    symbol: symbol,
    timeframe: timeframe,
    timestamp: new Date().toISOString(),
    message: "Market data integration requires additional API setup. Please configure your preferred data provider in the extension settings."
  };
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Handle notification actions
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'showNotification',
      notificationId: notificationId
    });
  });
});
