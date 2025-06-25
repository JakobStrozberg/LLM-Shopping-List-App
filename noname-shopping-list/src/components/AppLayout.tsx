import React from 'react';
import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';

export const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <div className="app-content">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}; 