import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Check, Trash2, ShoppingBag, ChevronDown, MoreVertical, Edit2, Heart, MessageCircle, Send } from 'lucide-react';
import { ProductSuggestion } from '../../components/ProductSuggestion';
import { Product } from '../../types';

const LIST_COLORS = [
  { name: 'Yellow', value: '#FFD500' },
  { name: 'Blue', value: '#4A90E2' },
  { name: 'Green', value: '#7ED321' },
  { name: 'Purple', value: '#9013FE' },
  { name: 'Orange', value: '#F5A623' },
  { name: 'Pink', value: '#FF6B6B' },
];

const LIST_ICONS = ['🛒', '🥦', '🍕', '🥛', '🍖', '🍰', '🧹', '💊'];

export const ShoppingList: React.FC = () => {
  const { 
    shoppingItems, 
    shoppingLists,
    currentList,
    addShoppingItem, 
    updateItemQuantity,
    toggleItemCheck, 
    deleteShoppingItem,
    createShoppingList,
    selectList,
    deleteList,
    currentUser,
    currentFamily,
    toggleItemLike,
    addItemComment,
    getItemComments,
    itemComments,
  } = useStore();
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [showListSelector, setShowListSelector] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [itemName, setItemName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  
  // New list creation state
  const [newListName, setNewListName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(LIST_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(LIST_COLORS[0].value);

  const currentItems = shoppingItems.filter(item => item.listId === currentList?.id);
  const uncheckedItems = currentItems.filter(item => !item.checked);
  const checkedItems = currentItems.filter(item => item.checked);
  
  const familyLists = shoppingLists.filter(list => list.familyId === currentFamily?.id);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && currentList) {
      addShoppingItem(itemName, undefined, selectedProduct?.image);
      setItemName('');
      setSelectedProduct(null);
      setShowAddItem(false);
    }
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createShoppingList(newListName, selectedIcon, selectedColor);
      setNewListName('');
      setShowCreateList(false);
      setShowListSelector(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setItemName(product.name);
  };

  const toggleComments = (itemId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = (itemId: string) => {
    const text = commentTexts[itemId];
    if (text?.trim()) {
      addItemComment(itemId, text.trim());
      setCommentTexts({ ...commentTexts, [itemId]: '' });
    }
  };

  const handleCommentTextChange = (itemId: string, text: string) => {
    setCommentTexts({ ...commentTexts, [itemId]: text });
  };

  if (!currentList && familyLists.length === 0) {
    return (
      <div className="shopping-list-screen modern">
        <div className="empty-lists-state">
          <ShoppingBag size={64} strokeWidth={1.5} />
          <h2>No shopping lists yet</h2>
          <p>Create your first list to get started</p>
          <button 
            className="btn-create-first-list"
            onClick={() => setShowCreateList(true)}
          >
            <Plus size={20} />
            Create List
          </button>
        </div>
        
        {showCreateList && (
          <div className="modal-overlay" onClick={() => setShowCreateList(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Create New List</h3>
              <form onSubmit={handleCreateList}>
                <input
                  type="text"
                  placeholder="List name (e.g., Weekly Groceries)"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="input modern"
                  autoFocus
                />
                
                <div className="icon-selector">
                  <label>Choose an icon:</label>
                  <div className="icon-grid">
                    {LIST_ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-option ${selectedIcon === icon ? 'selected' : ''}`}
                        onClick={() => setSelectedIcon(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="color-selector">
                  <label>Choose a color:</label>
                  <div className="color-grid">
                    {LIST_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setSelectedColor(color.value)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowCreateList(false)} className="btn-modal-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-primary">
                    Create List
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="shopping-list-screen modern">
      <div className="list-header modern">
        <button 
          className="list-selector-btn"
          onClick={() => setShowListSelector(!showListSelector)}
          style={{ borderColor: currentList?.color }}
        >
          <span className="list-icon">{currentList?.icon}</span>
          <span className="list-name">{currentList?.name || 'Select a list'}</span>
          <ChevronDown size={20} className={showListSelector ? 'rotated' : ''} />
        </button>
        
        <button
          className="btn-add-item"
          onClick={() => setShowAddItem(!showAddItem)}
          style={{ backgroundColor: currentList?.color }}
        >
          <Plus size={24} />
        </button>
      </div>

      {showListSelector && (
        <div className="list-dropdown">
          {familyLists.map(list => (
            <button
              key={list.id}
              className={`list-option ${currentList?.id === list.id ? 'active' : ''}`}
              onClick={() => {
                selectList(list.id);
                setShowListSelector(false);
              }}
            >
              <span className="list-icon">{list.icon}</span>
              <span className="list-name">{list.name}</span>
              <span className="item-count">{list.itemCount} items</span>
              {currentList?.id === list.id && (
                <button
                  className="btn-delete-list"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this list and all its items?')) {
                      deleteList(list.id);
                      setShowListSelector(false);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </button>
          ))}
          <button
            className="list-option create-new"
            onClick={() => {
              setShowCreateList(true);
              setShowListSelector(false);
            }}
          >
            <Plus size={20} />
            Create New List
          </button>
        </div>
      )}

      {showAddItem && currentList && (
        <form onSubmit={handleAddItem} className="add-item-form modern">
          <ProductSuggestion
            value={itemName}
            onChange={setItemName}
            onProductSelect={handleProductSelect}
            placeholder="Add item..."
            className="product-input-modern"
          />
          <div className="form-actions modern">
            <button type="button" onClick={() => {
              setShowAddItem(false);
              setItemName('');
              setSelectedProduct(null);
            }} className="btn-cancel">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-add"
              style={{ backgroundColor: currentList.color }}
              disabled={!itemName.trim()}
            >
              Add
            </button>
          </div>
        </form>
      )}

      <div className="items-container modern">
        {uncheckedItems.length === 0 && checkedItems.length === 0 && (
          <div className="empty-state modern">
            <p>Your list is empty</p>
            <p className="hint">Tap + to add items</p>
          </div>
        )}

        {uncheckedItems.map((item) => (
          <div key={item.id} className="item-card modern">
            <button
              className="check-btn modern"
              onClick={() => toggleItemCheck(item.id)}
              style={{ borderColor: currentList?.color }}
            >
              <div className="checkbox modern" />
            </button>
            
            <div className="item-details">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="item-thumbnail"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="item-info">
                <h4>{item.name}</h4>
                <span className="item-quantity">Qty: {item.quantity}</span>
                <div className="item-meta">
                  <span className="added-by">{item.addedByAvatar} {item.addedByName}</span>
                </div>
              </div>
            </div>

            <div className="item-actions modern">
              <div className="quantity-control modern">
                <button
                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <div className="social-actions">
                <button
                  className={`btn-like ${item.likedBy.includes(currentUser?.id || '') ? 'liked' : ''}`}
                  onClick={() => toggleItemLike(item.id)}
                >
                  <Heart size={18} />
                  {item.likedBy.length > 0 && <span>{item.likedBy.length}</span>}
                </button>
                
                <button
                  className="btn-comment"
                  onClick={() => toggleComments(item.id)}
                >
                  <MessageCircle size={18} />
                  {getItemComments(item.id).length > 0 && (
                    <span>{getItemComments(item.id).length}</span>
                  )}
                </button>
              </div>
              
              <button
                className="btn-delete-item"
                onClick={() => deleteShoppingItem(item.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            {expandedComments.has(item.id) && (
              <div className="comments-section">
                <div className="comments-list">
                  {getItemComments(item.id).map((comment) => (
                    <div key={comment.id} className="comment">
                      <span className="comment-avatar">{comment.userAvatar}</span>
                      <div className="comment-content">
                        <span className="comment-author">{comment.userName}</span>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="comment-input-container">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentTexts[item.id] || ''}
                    onChange={(e) => handleCommentTextChange(item.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(item.id);
                      }
                    }}
                    className="comment-input"
                  />
                  <button
                    className="btn-send-comment"
                    onClick={() => handleAddComment(item.id)}
                    disabled={!commentTexts[item.id]?.trim()}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {checkedItems.length > 0 && (
          <>
            <div className="completed-section">
              <span>Completed ({checkedItems.length})</span>
            </div>
            {checkedItems.map((item) => (
              <div key={item.id} className="item-card modern completed">
                <button
                  className="check-btn modern"
                  onClick={() => toggleItemCheck(item.id)}
                  style={{ backgroundColor: currentList?.color, borderColor: currentList?.color }}
                >
                  <Check size={18} color="white" />
                </button>
                
                <div className="item-details">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <div className="item-meta">
                      <span className="added-by">{item.addedByAvatar} {item.addedByName}</span>
                    </div>
                  </div>
                </div>

                <div className="item-actions modern">
                  <div className="social-actions">
                    <button
                      className={`btn-like ${item.likedBy.includes(currentUser?.id || '') ? 'liked' : ''}`}
                      onClick={() => toggleItemLike(item.id)}
                    >
                      <Heart size={18} />
                      {item.likedBy.length > 0 && <span>{item.likedBy.length}</span>}
                    </button>
                    
                    <button
                      className="btn-comment"
                      onClick={() => toggleComments(item.id)}
                    >
                      <MessageCircle size={18} />
                      {getItemComments(item.id).length > 0 && (
                        <span>{getItemComments(item.id).length}</span>
                      )}
                    </button>
                  </div>
                  
                  <button
                    className="btn-delete-item"
                    onClick={() => deleteShoppingItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {expandedComments.has(item.id) && (
                  <div className="comments-section">
                    <div className="comments-list">
                      {getItemComments(item.id).map((comment) => (
                        <div key={comment.id} className="comment">
                          <span className="comment-avatar">{comment.userAvatar}</span>
                          <div className="comment-content">
                            <span className="comment-author">{comment.userName}</span>
                            <p className="comment-text">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="comment-input-container">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentTexts[item.id] || ''}
                        onChange={(e) => handleCommentTextChange(item.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(item.id);
                          }
                        }}
                        className="comment-input"
                      />
                      <button
                        className="btn-send-comment"
                        onClick={() => handleAddComment(item.id)}
                        disabled={!commentTexts[item.id]?.trim()}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {showCreateList && (
        <div className="modal-overlay" onClick={() => setShowCreateList(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New List</h3>
            <form onSubmit={handleCreateList}>
              <input
                type="text"
                placeholder="List name (e.g., Weekly Groceries)"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="input modern"
                autoFocus
              />
              
              <div className="icon-selector">
                <label>Choose an icon:</label>
                <div className="icon-grid">
                  {LIST_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${selectedIcon === icon ? 'selected' : ''}`}
                      onClick={() => setSelectedIcon(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="color-selector">
                <label>Choose a color:</label>
                <div className="color-grid">
                  {LIST_COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.value)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateList(false)} className="btn-modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-modal-primary">
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 