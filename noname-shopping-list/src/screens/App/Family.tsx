import React from 'react';
import { useStore } from '../../store';
import { Trophy, Copy, Users, LogOut } from 'lucide-react';

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

  return (
    <div className="family-screen">
      <div className="family-header">
        <h2>{currentFamily?.name}</h2>
        <div className="invite-section">
          <p className="invite-label">Invite Code</p>
          <div className="invite-code-container">
            <span className="invite-code">{currentFamily?.inviteCode}</span>
            <button onClick={copyInviteCode} className="copy-btn">
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="points-card">
        <Trophy size={40} className="trophy-icon" />
        <div className="points-info">
          <h3>Family Points</h3>
          <p className="points-value">{currentFamily?.totalPoints.toLocaleString()}</p>
          <p className="points-label">NoName Points earned together</p>
        </div>
      </div>

      <div className="members-section">
        <h3>
          <Users size={20} />
          Family Members ({familyMembers.length}/5)
        </h3>
        <div className="members-list">
          {familyMembers.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-avatar">{member.avatar}</div>
              <div className="member-info">
                <p className="member-name">
                  {member.name}
                  {member.id === currentUser?.id && ' (You)'}
                </p>
                <p className="member-email">{member.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="family-stats">
        <div className="stat-card">
          <h4>This Week</h4>
          <p className="stat-value">12</p>
          <p className="stat-label">Items purchased</p>
        </div>
        <div className="stat-card">
          <h4>Total Savings</h4>
          <p className="stat-value">$45</p>
          <p className="stat-label">Using NoName brand</p>
        </div>
      </div>

      <div className="logout-section">
        <button onClick={handleLogout} className="btn btn-logout">
          <LogOut size={20} />
          Reset & Logout
        </button>
      </div>
    </div>
  );
}; 