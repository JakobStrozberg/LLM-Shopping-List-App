import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { User, AVATARS } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Mail, Apple } from 'lucide-react';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

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
    // Mock Apple Sign In
    const newUser: User = {
      id: uuidv4(),
      email: 'apple.user@icloud.com',
      name: 'Apple User',
      avatar: selectedAvatar,
    };
    
    setCurrentUser(newUser);
    navigate('/family-setup');
  };

  return (
    <div className="auth-screen">
      <div className="logo-container">
        <div className="logo">🛒</div>
        <h1>NoName Shopping List</h1>
        <p className="tagline">Shop together, save together</p>
      </div>

      <form onSubmit={handleSignUp} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />

        <div className="avatar-selector">
          <p className="label">Choose your avatar:</p>
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

        <button type="submit" className="btn btn-primary">
          <Mail size={20} />
          Sign up with Email
        </button>
      </form>

      <div className="divider">OR</div>

      <button onClick={handleAppleSignIn} className="btn btn-apple">
        <Apple size={20} />
        Sign in with Apple
      </button>

      <p className="auth-link">
        Already have an account? <a href="/signin">Sign in</a>
      </p>
    </div>
  );
}; 