import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  Bell, 
  TrendingUp, 
  History, 
  GraduationCap,
  Globe,
  User,
  Shield,
  Link
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const tradingModules = [
  {
    id: 'journal',
    title: 'Trade Journal',
    description: 'Log trades and track performance',
    icon: BookOpen,
    color: '#FF10F0'
  },
  {
    id: 'calendar',
    title: 'Economic Calendar',
    description: 'Upcoming economic events',
    icon: Calendar,
    color: '#00D4FF'
  },
  {
    id: 'alerts',
    title: 'Alerts & Notifications',
    description: 'Custom price and news alerts',
    icon: Bell,
    color: '#8A2BE2'
  },
  {
    id: 'sentiment',
    title: 'Sentiment Analysis',
    description: 'Market sentiment insights',
    icon: TrendingUp,
    color: '#0066FF'
  },
  {
    id: 'backtesting',
    title: 'Strategy Backtesting',
    description: 'Test strategies on historical data',
    icon: History,
    color: '#FF10F0'
  },
  {
    id: 'education',
    title: 'Learning Hub',
    description: 'Trading tutorials and guides',
    icon: GraduationCap,
    color: '#00D4FF'
  },
  {
    id: 'multi-asset',
    title: 'Multi-Asset Support',
    description: 'Forex, stocks, crypto, commodities',
    icon: Globe,
    color: '#8A2BE2'
  },
  {
    id: 'personality',
    title: 'AI Personality',
    description: 'Customize assistant behavior',
    icon: User,
    color: '#0066FF'
  },
  {
    id: 'compliance',
    title: 'Risk & Compliance',
    description: 'Trading risk reminders',
    icon: Shield,
    color: '#FF10F0'
  },
  {
    id: 'integration',
    title: 'Platform Integration',
    description: 'Connect trading accounts',
    icon: Link,
    color: '#00D4FF'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const handleModuleClick = (moduleId: string) => {
    console.log(`Opening module: ${moduleId}`);
    // Here you would implement the specific functionality for each module
    // For now, we'll just log it
  };
  
  return (
    <div className="sidebar-overlay">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Trading Tools</h3>
          <button className="close-sidebar" onClick={onClose}>×</button>
        </div>
        
        <div className="sidebar-content">
          {tradingModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                className="sidebar-item"
                onClick={() => handleModuleClick(module.id)}
                style={{
                  borderLeft: `3px solid ${module.color}`,
                }}
              >
                <div className="sidebar-item-icon" style={{ color: module.color }}>
                  <IconComponent size={20} />
                </div>
                <div className="sidebar-item-content">
                  <div className="sidebar-item-title">{module.title}</div>
                  <div className="sidebar-item-description">{module.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="sidebar-footer">
          <div className="version-info">
            MarketMinds AI v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
