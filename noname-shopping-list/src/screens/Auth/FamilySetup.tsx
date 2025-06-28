import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Users, Plus, LogIn, UserPlus, ArrowRight, Home, Sparkles, AlertCircle } from 'lucide-react';

export const FamilySetup: React.FC = () => {
  const navigate = useNavigate();
  const { createFamily, joinFamily, setupDemoFamily, currentUser } = useStore();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (familyName.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        createFamily(familyName);
        navigate('/app/shopping');
      }, 1000);
    }
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      setIsLoading(true);
      setError('');
      
      setTimeout(() => {
        const success = joinFamily(inviteCode.toUpperCase());
        if (success) {
          navigate('/app/shopping');
        } else {
          setError('Invalid invite code or family is full');
          setIsLoading(false);
        }
      }, 1000);
    }
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setupDemoFamily();
      navigate('/app/shopping');
    }, 800);
  };

  if (!currentUser) {
    navigate('/');
    return null;
  }

  if (mode === 'choose') {
    return (
      <div className="family-setup-screen">
        <div className="family-setup-hero">
          <div className="setup-header">
            <div className="welcome-badge">
              <Sparkles size={16} />
              <span>Welcome</span>
            </div>
            <h1 className="setup-title">
              Hi {currentUser.name}! 👋
            </h1>
            <p className="setup-subtitle">
              Let's connect you with your family to start shopping together and earning rewards.
            </p>
          </div>

          <div className="setup-options">
            <div className="option-card-modern" onClick={() => setMode('create')}>
              <div className="option-icon-container">
                <div className="option-icon create-icon">
                  <Plus size={28} />
                </div>
              </div>
              <div className="option-content">
                <h3>Create a Family</h3>
                <p>Start a new shopping group and invite up to 4 family members</p>
                <div className="option-arrow">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>

            <div className="option-card-modern" onClick={() => setMode('join')}>
              <div className="option-icon-container">
                <div className="option-icon join-icon">
                  <UserPlus size={28} />
                </div>
              </div>
              <div className="option-content">
                <h3>Join a Family</h3>
                <p>Enter an invite code from your family member</p>
                <div className="option-arrow">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="demo-section">
            <div className="demo-divider">
              <span>or</span>
            </div>
            <button
              className="btn btn-demo-modern"
              onClick={handleQuickDemo}
              disabled={isLoading}
            >
              <Home size={20} />
              <span>Try Quick Demo</span>
              <span className="demo-badge">Join The Smiths</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="family-setup-screen">
      <div className="setup-form-header">
        <button 
          onClick={() => {
            setMode('choose');
            setError('');
            setIsLoading(false);
          }}
          className="back-btn-setup"
          disabled={isLoading}
        >
          ← Back
        </button>
        <h2>{mode === 'create' ? 'Create Your Family' : 'Join a Family'}</h2>
      </div>

      <div className="setup-form-container">
        {mode === 'create' && (
          <div className="form-content">
            <div className="form-icon-header">
              <div className="form-icon create-icon">
                <Plus size={32} />
              </div>
              <h3>Create Your Family Group</h3>
              <p>Give your family group a name that everyone will recognize</p>
            </div>

            <form onSubmit={handleCreateFamily} className="family-form-modern">
              <div className="form-group">
                <label htmlFor="familyName" className="form-label">
                  Family Name
                </label>
                <input
                  id="familyName"
                  type="text"
                  placeholder="e.g., The Smiths, Johnson Family"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                  className="input input-large"
                  maxLength={30}
                  disabled={isLoading}
                />
                <div className="form-hint">
                  <Users size={14} />
                  <span>Up to 5 members can join your family</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={isLoading || !familyName.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Creating Family...</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Create Family</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {mode === 'join' && (
          <div className="form-content">
            <div className="form-icon-header">
              <div className="form-icon join-icon">
                <UserPlus size={32} />
              </div>
              <h3>Join Your Family</h3>
              <p>Enter the invite code shared by your family member</p>
            </div>

            <form onSubmit={handleJoinFamily} className="family-form-modern">
              <div className="form-group">
                <label htmlFor="inviteCode" className="form-label">
                  Invite Code
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  placeholder="ABC123"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                  className="input input-large code-input"
                  style={{ textTransform: 'uppercase' }}
                  maxLength={10}
                  disabled={isLoading}
                />
                <div className="form-hint">
                  <LogIn size={14} />
                  <span>Ask your family member for the 6-character code</span>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={isLoading || !inviteCode.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Joining Family...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Join Family</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}; 