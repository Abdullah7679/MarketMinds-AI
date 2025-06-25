// Content script entry point
import React from 'react';
import { createRoot } from 'react-dom/client';
import MarketMindsWidget from './extension/content.tsx';

// Inject the MarketMinds AI widget
function injectWidget() {
  // Prevent multiple injections
  if (document.getElementById('marketminds-ai-widget')) {
    return;
  }

  // Create container for the widget
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'marketminds-ai-widget';
  widgetContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2147483647;
    font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
  `;

  document.body.appendChild(widgetContainer);

  // Render React component
  const root = createRoot(widgetContainer);
  root.render(React.createElement(MarketMindsWidget));
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectWidget);
} else {
  injectWidget();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showNotification') {
    // Handle notification display
    console.log('Show notification:', request.notificationId);
  }
});
