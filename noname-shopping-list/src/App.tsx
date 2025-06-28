import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';

import { SignUp } from './screens/Auth/SignUp';
import { FamilySetup } from './screens/Auth/FamilySetup';

import { AppLayout } from './components/AppLayout';
import { ShoppingList } from './screens/App/ShoppingList';
import { Chat } from './screens/App/Chat';
import { Family } from './screens/App/Family';

function App() {
  const { currentUser, currentFamily } = useStore();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!currentUser) {
      return <Navigate to="/" replace />;
    }
    if (!currentFamily) {
      return <Navigate to="/family-setup" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/family-setup" replace /> : <SignUp />} />
        <Route path="/signin" element={<Navigate to="/" replace />} />
        <Route path="/family-setup" element={
          currentUser ? (
            currentFamily ? <Navigate to="/app/shopping" replace /> : <FamilySetup />
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/shopping" replace />} />
          <Route path="shopping" element={<ShoppingList />} />
          <Route path="chat" element={<Chat />} />
          <Route path="family" element={<Family />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
