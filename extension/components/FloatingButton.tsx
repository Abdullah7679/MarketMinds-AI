import React, { useState, useRef } from 'react';
import { Brain, TrendingUp } from 'lucide-react';

interface FloatingButtonProps {
  isExpanded: boolean;
  position: { x: number; y: number };
  onToggle: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  isExpanded,
  position,
  onToggle,
  onPositionChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y));
    
    onPositionChange({ x: newX, y: newY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);
  
  return (
    <div
      ref={buttonRef}
      className={`marketminds-floating-button ${isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF10F0 0%, #00D4FF 50%, #8A2BE2 100%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 30px rgba(255, 16, 240, 0.6), 0 0 60px rgba(0, 212, 255, 0.4)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        pointerEvents: 'all',
        zIndex: 2147483647,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'pulse-glow 2s infinite'
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (!isDragging) {
          onToggle();
        }
      }}
    >
      <div className="button-content" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: '24px'
      }}>
        {isExpanded ? (
          <Brain size={28} />
        ) : (
          <TrendingUp size={28} />
        )}
      </div>
      
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(255, 16, 240, 0.6), 0 0 60px rgba(0, 212, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 16, 240, 0.8), 0 0 80px rgba(0, 212, 255, 0.6);
          }
        }
        
        .marketminds-floating-button:hover {
          transform: scale(1.1);
          box-shadow: 0 0 40px rgba(255, 16, 240, 0.8), 0 0 80px rgba(0, 212, 255, 0.6) !important;
        }
        
        .marketminds-floating-button.dragging {
          transform: scale(1.05);
          cursor: grabbing !important;
        }
      `}</style>
    </div>
  );
};

export default FloatingButton;
