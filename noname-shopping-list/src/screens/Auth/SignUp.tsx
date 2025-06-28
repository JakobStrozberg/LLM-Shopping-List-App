import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { User, AVATARS } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Mail, Apple, Users, ShoppingCart, Heart, Sparkles, ArrowRight } from 'lucide-react';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'signup'>('welcome');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: uuidv4(),
      email,
      name,
      avatar: selectedAvatar,
    };
    
    setCurrentUser(newUser);
    navigate('/family-setup');
  };

  const handleAppleSignIn = () => {
    const newUser: User = {
      id: uuidv4(),
      email: 'apple.user@icloud.com',
      name: 'Apple User',
      avatar: selectedAvatar,
    };
    
    setCurrentUser(newUser);
    navigate('/family-setup');
  };

  const handleGetStarted = () => {
    setCurrentStep('signup');
  };

  if (currentStep === 'welcome') {
    return (
      <div className="welcome-screen">
        <div className="welcome-hero">
          <div className="brand-logo">
            <img 
              src="/nobck.png" 
              alt="No Name Brand" 
              className="logo-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('logo-fallback');
              }}
            />
            <div className="logo-fallback-content">🛒</div>
          </div>
          
          <div className="welcome-content">
            <h1 className="welcome-title">
              Smart Shopping,
              <span className="title-highlight"> Together</span>
            </h1>
            <p className="welcome-subtitle">
              Connect with family, share lists, and earn rewards while shopping smarter with No Name products.
            </p>
          </div>

          <div className="features-preview">
            <div className="feature-item">
              <div className="feature-icon">
                <Users size={24} />
              </div>
              <div className="feature-text">
                <h3>Family Sharing</h3>
                <p>Shop together with up to 5 family members</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <ShoppingCart size={24} />
              </div>
              <div className="feature-text">
                <h3>Smart Lists</h3>
                <p>AI-powered suggestions and organization</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Heart size={24} />
              </div>
              <div className="feature-text">
                <h3>Earn Rewards</h3>
                <p>Get points for No Name products and redeem gifts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="welcome-actions">
          <button 
            onClick={handleGetStarted}
            className="btn btn-primary btn-large"
          >
            <span>Get Started</span>
            <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={handleAppleSignIn} 
            className="btn btn-apple btn-large"
          >
            <Apple size={20} />
            <span>Demo</span>
          </button>
        </div>

        <div className="welcome-footer">
          <p>Join thousands of families saving money together</p>
          <div className="social-proof">
            <div className="proof-item">
              <Sparkles size={16} />
              <span>$2M+ saved collectively</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="signup-header">
        <button 
          onClick={() => setCurrentStep('welcome')} 
          className="back-btn"
        >
          ← Back
        </button>
        <h2>Create Your Account</h2>
      </div>

      <div className="signup-form-container">
        <form onSubmit={handleSignUp} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
            />
          </div>

          <div className="avatar-selector">
            <p className="form-label">Choose Your Avatar</p>
            <div className="avatar-grid">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            <Mail size={20} />
            <span>Create Account</span>
          </button>
        </form>

        <div className="signup-divider">
          <span>or</span>
        </div>

        <button onClick={handleAppleSignIn} className="btn btn-apple btn-large">
          <Apple size={20} />
          <span>Demo</span>
        </button>

        <p className="signup-terms">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}; 