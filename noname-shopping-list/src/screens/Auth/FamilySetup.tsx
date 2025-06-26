import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Users, Plus, LogIn, UserPlus } from 'lucide-react';

export const FamilySetup: React.FC = () => {
  const navigate = useNavigate();
  const { createFamily, joinFamily, setupDemoFamily, currentUser } = useStore();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyName.trim()) {
      createFamily(familyName);
      navigate('/app/shopping');
    }
  };

  const handleJoinFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      const success = joinFamily(inviteCode.toUpperCase());
      if (success) {
        navigate('/app/shopping');
      } else {
        setError('Invalid invite code or family is full');
      }
    }
  };

  const handleQuickDemo = () => {
    // Setup the demo family with pre-populated data
    setupDemoFamily();
    navigate('/app/shopping');
  };

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="family-setup-screen">
      <div className="header">
        <h1>Welcome, {currentUser.name}!</h1>
        <p>Let's get you connected with your family</p>
      </div>

      {mode === 'choose' && (
        <div className="options">
          <button
            className="option-card"
            onClick={() => setMode('create')}
          >
            <Plus size={40} />
            <h3>Create a Family</h3>
            <p>Start a new shopping group</p>
          </button>

          <button
            className="option-card"
            onClick={() => setMode('join')}
          >
            <LogIn size={40} />
            <h3>Join a Family</h3>
            <p>Enter an invite code</p>
          </button>

          <button
            className="btn btn-demo"
            onClick={handleQuickDemo}
          >
            <Users size={20} />
            Quick Demo (Join The Smiths)
          </button>
        </div>
      )}

      {mode === 'create' && (
        <form onSubmit={handleCreateFamily} className="family-form">
          <h2>Create Your Family</h2>
          <input
            type="text"
            placeholder="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            required
            className="input"
            maxLength={30}
          />
          <p className="hint">Up to 5 members can join your family</p>
          <div className="form-actions">
            <button type="button" onClick={() => setMode('choose')} className="btn btn-secondary">
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Create Family
            </button>
          </div>
        </form>
      )}

      {mode === 'join' && (
        <form onSubmit={handleJoinFamily} className="family-form">
          <h2>Join a Family</h2>
          <input
            type="text"
            placeholder="Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
            className="input"
            style={{ textTransform: 'uppercase' }}
            maxLength={10}
          />
          {error && <p className="error">{error}</p>}
          <p className="hint">Ask your family member for the invite code</p>
          <div className="form-actions">
            <button type="button" onClick={() => {
              setMode('choose');
              setError('');
            }} className="btn btn-secondary">
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Join Family
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 