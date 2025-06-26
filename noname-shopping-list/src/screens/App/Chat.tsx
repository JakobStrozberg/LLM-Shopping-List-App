import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { Send } from 'lucide-react';

export const Chat: React.FC = () => {
  const { chatMessages, sendMessage, currentUser, currentFamily, mockUsers } = useStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const familyMessages = chatMessages.filter(
    msg => msg.familyId === currentFamily?.id
  );

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <h2 className="chat-title">{currentFamily?.name} Chat</h2>
      </div>

      <div className="messages-container">
        {familyMessages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p className="empty-title">No messages yet</p>
            <p className="empty-subtitle">Start the conversation!</p>
          </div>
        )}

        {familyMessages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.userId === currentUser?.id ? 'own' : ''}`}
          >
            {msg.userId !== currentUser?.id && (
              <div className="message-avatar">{msg.userAvatar}</div>
            )}
            <div className="message-content">
              {msg.userId !== currentUser?.id && (
                <span className="message-author">{msg.userName}</span>
              )}
              <div className="message-bubble">
                <p className="message-text">{msg.message}</p>
              </div>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!message.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}; 