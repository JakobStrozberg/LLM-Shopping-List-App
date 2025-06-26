import React from 'react';
import { useStore } from '../../store';
import { Trophy, Copy, Users, LogOut, Gift, Star, TrendingUp } from 'lucide-react';
import { FamilyReward } from '../../types';

// Mock rewards data
const FAMILY_REWARDS: FamilyReward[] = [
  {
    id: '1',
    name: 'Glassware Set',
    description: 'Premium 12-piece glassware set',
    pointsRequired: 5000,
    image: '/reward.jpeg'
  },
  {
    id: '2',
    name: 'Kitchen Knife Set',
    description: 'Professional 5-piece knife set',
    pointsRequired: 8000,
    image: '/knifeset.jpg'
  },
  {
    id: '3',
    name: 'Cookware Set',
    description: 'Non-stick 10-piece cookware',
    pointsRequired: 12000,
    image: '/cookwear.jpg'
  }
];

export const Family: React.FC = () => {
  const { currentFamily, currentUser, mockUsers, logout } = useStore();

  const familyMembers = currentFamily?.members.map(memberId => 
    mockUsers.find(user => user.id === memberId) || 
    { id: memberId, name: 'Unknown', avatar: '👤', email: '' }
  ) || [];

  const copyInviteCode = () => {
    if (currentFamily?.inviteCode) {
      navigator.clipboard.writeText(currentFamily.inviteCode);
      // In a real app, show a toast notification
      alert('Invite code copied!');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? This will clear all your data.')) {
      logout();
    }
  };

  // Calculate progress to next reward
  const currentPoints = currentFamily?.totalPoints || 0;
  const nextReward = FAMILY_REWARDS.find(reward => reward.pointsRequired > currentPoints) || FAMILY_REWARDS[0];
  const progressPercentage = nextReward ? (currentPoints / nextReward.pointsRequired) * 100 : 100;
  const pointsToNext = nextReward ? nextReward.pointsRequired - currentPoints : 0;

  return (
    <div className="family-screen">
      {/* Modern Hero Section with Progress */}
      <div className="rewards-hero">
        <div className="rewards-hero-content">
          <h2 className="rewards-title">Family Rewards</h2>
          <p className="rewards-subtitle">Shop together, earn rewards together!</p>
          
          <div className="points-display">
            <div className="points-current">
              <Star className="star-icon" size={24} />
              <span className="points-number">{currentPoints.toLocaleString()}</span>
              <span className="points-label">points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Reward Progress Card */}
      <div className="next-reward-card">
        <div className="reward-progress-header">
          <h3>Next Reward</h3>
          <span className="points-remaining">{pointsToNext.toLocaleString()} points to go!</span>
        </div>
        
        <div className="reward-preview">
          <img 
            src={nextReward?.image || '/reward.jpeg'} 
            alt={nextReward?.name} 
            className="reward-preview-image"
          />
          <div className="reward-preview-info">
            <h4>{nextReward?.name}</h4>
            <p>{nextReward?.description}</p>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="progress-labels">
            <span>{currentPoints.toLocaleString()}</span>
            <span>{nextReward?.pointsRequired.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* All Rewards Grid */}
      <div className="rewards-section">
        <h3 className="section-title">
          <Gift size={20} />
          Available Rewards
        </h3>
        <div className="rewards-grid">
          {FAMILY_REWARDS.map((reward) => {
            const isUnlocked = currentPoints >= reward.pointsRequired;
            const progress = (currentPoints / reward.pointsRequired) * 100;
            
            return (
              <div key={reward.id} className={`reward-card ${isUnlocked ? 'unlocked' : ''}`}>
                <div className="reward-image-container">
                  <img src={reward.image} alt={reward.name} className="reward-image" />
                  {isUnlocked && (
                    <div className="reward-unlocked-badge">
                      <Trophy size={16} />
                      Unlocked!
                    </div>
                  )}
                </div>
                <div className="reward-content">
                  <h4 className="reward-name">{reward.name}</h4>
                  <p className="reward-description">{reward.description}</p>
                  <div className="reward-points">
                    <Star size={14} />
                    <span>{reward.pointsRequired.toLocaleString()} points</span>
                  </div>
                  {!isUnlocked && (
                    <div className="reward-mini-progress">
                      <div 
                        className="reward-mini-progress-fill" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Family Info Section */}
      <div className="family-info-section">
        <div className="family-header-modern">
          <div>
            <h3 className="family-name">{currentFamily?.name}</h3>
            <div className="invite-code-inline">
              <span className="invite-label">Invite Code:</span>
              <span className="invite-code">{currentFamily?.inviteCode}</span>
              <button onClick={copyInviteCode} className="copy-btn-inline">
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div className="weekly-stats">
            <div className="stat-item">
              <TrendingUp size={16} />
              <span className="stat-value">+325</span>
              <span className="stat-label">this week</span>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="members-section-modern">
          <h4 className="section-subtitle">
            <Users size={18} />
            Family Members ({familyMembers.length}/5)
          </h4>
          <div className="members-grid">
            {familyMembers.map((member) => (
              <div key={member.id} className="member-card-modern">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-details">
                  <p className="member-name">
                    {member.name}
                    {member.id === currentUser?.id && <span className="you-badge">You</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="logout-section">
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} />
          Reset & Logout
        </button>
      </div>
    </div>
  );
}; 