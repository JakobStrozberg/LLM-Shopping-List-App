import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Users } from 'lucide-react';

export const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/app/shopping', icon: ShoppingCart, label: 'List' },
    { path: '/app/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/app/family', icon: Users, label: 'Family' },
  ];

  return (
    <div className="tab-bar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
        
        return (
          <button
            key={tab.path}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon size={24} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}; 