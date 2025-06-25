import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Upload, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import VoiceRecorder from './VoiceRecorder';
import FileUpload from './FileUpload';
import { GeminiAPI } from '../utils/gemini';
import { ExtensionStorage } from '../utils/storage';
import { ChatMessage, ChatHistory } from '../utils/types';

interface ChatWidgetProps {
  position: { x: number; y: number };
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ position, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Calculate widget position
  const widgetStyle = {
    position: 'fixed' as const,
    left: `${Math.min(position.x, window.innerWidth - 350)}px`,
    top: `${Math.min(position.y - 500, window.innerHeight - 500)}px`,
    width: '350px',
    height: '500px',
    zIndex: 2147483646,
    pointerEvents: 'all' as const
  };
  
  useEffect(() => {
    // Load chat history
    ExtensionStorage.get(['chatHistory']).then((result) => {
      if (result.chatHistory) {
        setMessages(result.chatHistory);
      } else {
        // Welcome message
        setMessages([{
          id: '1',
          type: 'ai',
          content: 'Welcome to MarketMinds AI! I\'m your professional trading assistant. Ask me about market analysis, trading strategies, or any trading-related questions.',
          timestamp: new Date().toISOString()
        }]);
      }
    });
    
    // Focus input when widget opens
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  
  useEffect(() => {
    // Save chat history
    ExtensionStorage.set({ chatHistory: messages });
  }, [messages]);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    try {
      const response = await GeminiAPI.getChatResponse(userMessage, {
        previousMessages: messages.slice(-5), // Last 5 messages for context
        tradingContext: true
      });
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.text,
        timestamp: response.timestamp
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Sorry, I encountered an error: ${error.message}. Please check your API key in the extension settings.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleVoiceComplete = (transcript: string) => {
    setInputValue(transcript);
    setIsRecording(false);
  };
  
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      const response = await GeminiAPI.analyzeFile(file);
      
      const fileMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: `[Uploaded ${file.type.includes('image') ? 'image' : 'file'}: ${file.name}]`,
        timestamp: new Date().toISOString()
      };
      
      const analysisMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.analysis,
        timestamp: response.timestamp
      };
      
      setMessages(prev => [...prev, fileMessage, analysisMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Error analyzing file: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setShowFileUpload(false);
    }
  };
  
  return (
    <div style={widgetStyle}>
      <div className="marketminds-chat-widget">
        {/* Header */}
        <div className="widget-header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Settings size={18} />
            </button>
            <div className="logo">
              <span className="logo-text">MarketMinds AI</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="widget-body">
          {/* Sidebar */}
          {sidebarOpen && (
            <Sidebar onClose={() => setSidebarOpen(false)} />
          )}
          
          {/* Chat Area */}
          <div className={`chat-area ${sidebarOpen ? 'with-sidebar' : ''}`}>
            <div className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message ai-message">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="input-area">
              <div className="input-controls">
                <button
                  className={`control-button ${isRecording ? 'recording' : ''}`}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Mic size={18} />
                </button>
                
                <button
                  className="control-button"
                  onClick={() => setShowFileUpload(true)}
                >
                  <Upload size={18} />
                </button>
              </div>
              
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about markets, analysis, strategies..."
                className="message-input"
                disabled={isLoading}
              />
              
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Voice Recorder Modal */}
        {isRecording && (
          <VoiceRecorder
            onComplete={handleVoiceComplete}
            onCancel={() => setIsRecording(false)}
          />
        )}
        
        {/* File Upload Modal */}
        {showFileUpload && (
          <FileUpload
            onUpload={handleFileUpload}
            onCancel={() => setShowFileUpload(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
