import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from './TabBar';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab based on current path
  const getActiveTab = (): 'list' | 'family' | 'chat' => {
    if (location.pathname.includes('/chat')) return 'chat';
    if (location.pathname.includes('/family')) return 'family';
    return 'list';
  };
  
  const handleTabChange = (tab: 'list' | 'family' | 'chat') => {
    switch (tab) {
      case 'list':
        navigate('/app/shopping');
        break;
      case 'family':
        navigate('/app/family');
        break;
      case 'chat':
        navigate('/app/chat');
        break;
    }
  };
  
  return (
    <div className="app-layout">
      <div className="app-content">
        <Outlet />
      </div>
      <TabBar activeTab={getActiveTab()} onTabChange={handleTabChange} />
    </div>
  );
}; 