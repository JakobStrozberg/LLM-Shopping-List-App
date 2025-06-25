import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Check, Heart, MessageCircle } from 'lucide-react';

export const ShoppingList: React.FC = () => {
  const { 
    shoppingItems, 
    addShoppingItem, 
    toggleItemCheck, 
    toggleItemLike,
    currentUser,
    currentFamily,
    mockUsers 
  } = useStore();
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemComment, setItemComment] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim()) {
      addShoppingItem(itemName, itemComment || undefined);
      setItemName('');
      setItemComment('');
      setShowAddItem(false);
    }
  };

  const uncheckedItems = shoppingItems.filter(item => !item.checked);
  const checkedItems = shoppingItems.filter(item => item.checked);

  return (
    <div className="shopping-list-screen">
      <div className="list-header">
        <h2>{currentFamily?.name}'s List</h2>
        <button
          className="btn-add"
          onClick={() => setShowAddItem(!showAddItem)}
        >
          <Plus size={24} />
        </button>
      </div>

      {showAddItem && (
        <form onSubmit={handleAddItem} className="add-item-form">
          <input
            type="text"
            placeholder="Item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="input"
            autoFocus
          />
          <input
            type="text"
            placeholder="Comment (optional)"
            value={itemComment}
            onChange={(e) => setItemComment(e.target.value)}
            className="input"
          />
          <div className="form-actions">
            <button type="button" onClick={() => setShowAddItem(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Item
            </button>
          </div>
        </form>
      )}

      <div className="items-list">
        {uncheckedItems.length === 0 && checkedItems.length === 0 && (
          <div className="empty-state">
            <p>No items yet. Add your first item!</p>
          </div>
        )}

        {uncheckedItems.map((item) => (
          <div key={item.id} className="shopping-item">
            <button
              className="check-btn"
              onClick={() => toggleItemCheck(item.id)}
            >
              <div className="checkbox" />
            </button>
            
            <div className="item-content">
              <div className="item-header">
                <h3>{item.name}</h3>
                <div className="item-meta">
                  <span className="added-by">
                    <span className="avatar-mini">{item.addedByAvatar}</span>
                    {item.addedByName}
                  </span>
                </div>
              </div>
              {item.comment && (
                <p className="item-comment">
                  <MessageCircle size={14} />
                  {item.comment}
                </p>
              )}
            </div>

            <button
              className={`like-btn ${item.likedBy.includes(currentUser?.id || '') ? 'liked' : ''}`}
              onClick={() => toggleItemLike(item.id)}
            >
              <Heart size={20} />
              {item.likedBy.length > 0 && (
                <span className="like-count">{item.likedBy.length}</span>
              )}
            </button>
          </div>
        ))}

        {checkedItems.length > 0 && (
          <>
            <div className="section-divider">
              <span>Completed</span>
            </div>
            {checkedItems.map((item) => (
              <div key={item.id} className="shopping-item checked">
                <button
                  className="check-btn"
                  onClick={() => toggleItemCheck(item.id)}
                >
                  <div className="checkbox checked">
                    <Check size={16} />
                  </div>
                </button>
                
                <div className="item-content">
                  <div className="item-header">
                    <h3>{item.name}</h3>
                    <div className="item-meta">
                      <span className="added-by">
                        <span className="avatar-mini">{item.addedByAvatar}</span>
                        {item.addedByName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}; 