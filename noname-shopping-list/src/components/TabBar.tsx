import React from 'react';
import { ShoppingCart, Users, MessageCircle } from 'lucide-react';

interface TabBarProps {
  activeTab: 'list' | 'family' | 'chat';
  onTabChange: (tab: 'list' | 'family' | 'chat') => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-bar">
      <button
        className={`tab-item ${activeTab === 'list' ? 'active' : ''}`}
        onClick={() => onTabChange('list')}
      >
        <ShoppingCart size={24} />
        <span>Shopping</span>
      </button>
      
      <button
        className={`tab-item ${activeTab === 'family' ? 'active' : ''}`}
        onClick={() => onTabChange('family')}
      >
        <Users size={24} />
        <span>Rewards</span>
      </button>
      
      <button
        className={`tab-item ${activeTab === 'chat' ? 'active' : ''}`}
        onClick={() => onTabChange('chat')}
      >
        <MessageCircle size={24} />
        <span>Chat</span>
      </button>
    </div>
  );
}; 