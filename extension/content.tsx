import React, { useState, useEffect } from 'react';
import FloatingButton from './components/FloatingButton';
import ChatWidget from './components/ChatWidget';
import { ExtensionStorage } from './utils/storage';

const MarketMindsWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  
  useEffect(() => {
    // Load settings from extension storage
    ExtensionStorage.get(['isEnabled', 'position']).then((result) => {
      setIsEnabled(result.isEnabled !== false);
      if (result.position) {
        setPosition(result.position);
      }
    });
    
    // Listen for settings changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        if (changes.isEnabled) {
          setIsEnabled(changes.isEnabled.newValue);
        }
        if (changes.position) {
          setPosition(changes.position.newValue);
        }
      }
    });
  }, []);
  
  const handleToggleWidget = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    setPosition(newPosition);
    ExtensionStorage.set({ position: newPosition });
  };
  
  if (!isEnabled) {
    return null;
  }
  
  return (
    <div className="marketminds-ai-widget">
      <FloatingButton
        isExpanded={isExpanded}
        position={position}
        onToggle={handleToggleWidget}
        onPositionChange={handlePositionChange}
      />
      
      {isExpanded && (
        <ChatWidget
          position={position}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default MarketMindsWidget;
