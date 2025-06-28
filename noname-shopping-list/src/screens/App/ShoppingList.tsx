import React, { useState } from 'react';
import { useStore } from '../../store';
import { 
  Plus, Check, X, ChevronDown, ChevronUp, Heart, 
  MessageCircle, Send, Minus, List, Grid3x3, 
  Star 
} from 'lucide-react';
import { ProductSuggestion } from '../../components/ProductSuggestion';
import { SmartSuggestions } from '../../components/SmartSuggestions';
import { ProductTags } from '../../components/ProductTags';
import { Product } from '../../types';
import { GROCERY_CATEGORIES } from '../../config/openai';

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
  } = useStore();
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [showListSelector, setShowListSelector] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [itemName, setItemName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [sortByCategory, setSortByCategory] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(GROCERY_CATEGORIES));
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  
  const [newListName, setNewListName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(LIST_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(LIST_COLORS[0].value);

  const currentItems = shoppingItems.filter(item => item.listId === currentList?.id);
  const uncheckedItems = currentItems.filter(item => !item.checked);
  const checkedItems = currentItems.filter(item => item.checked);
  
  const groupedUncheckedItems = sortByCategory 
    ? GROCERY_CATEGORIES.reduce((acc, category) => {
        const items = uncheckedItems.filter(item => item.category === category);
        if (items.length > 0) {
          acc.push({ category, items });
        }
        return acc;
      }, [] as { category: string; items: typeof uncheckedItems }[])
    : [{ category: 'All Items', items: uncheckedItems }];
  
  const familyLists = shoppingLists.filter(list => list.familyId === currentFamily?.id);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && currentList) {
      await addShoppingItem(itemName, undefined, selectedProduct?.image, 1, selectedProduct?.points);
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

  const handleSmartSuggestionSelect = async (product: Product) => {
    if (currentList) {
      await addShoppingItem(product.name, undefined, product.image, 1, product.points);
    }
  };

  const handleAddComment = (itemId: string) => {
    const text = commentTexts[itemId];
    if (text?.trim()) {
      addItemComment(itemId, text.trim());
      setCommentTexts({ ...commentTexts, [itemId]: '' });
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
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

  if (!currentList && familyLists.length === 0) {
    return (
      <div className="shopping-list">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2 className="empty-title">No shopping lists yet</h2>
          <p className="empty-subtitle">Create your first list to get started</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateList(true)}
          >
            <Plus size={20} />
            Create List
          </button>
        </div>
        
        {showCreateList && (
          <div className="modal-overlay" onClick={() => setShowCreateList(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Create New List</h3>
              <form onSubmit={handleCreateList} className="modal-form">
                <div className="form-group">
                  <label className="form-label">List Name</label>
                  <input
                    type="text"
                    placeholder="Enter list name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="input"
                    autoFocus
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Icon</label>
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
                
                <div className="form-group">
                  <label className="form-label">Color</label>
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
                  <button type="button" onClick={() => setShowCreateList(false)} className="modal-btn modal-btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="modal-btn modal-btn-primary">
                    Create
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
    <div className="shopping-list">
      <div className="list-header">
        <button 
          className="list-selector-btn"
          onClick={() => setShowListSelector(!showListSelector)}
          style={{ backgroundColor: currentList?.color || '#FFD500' }}
        >
          <span className="list-icon">{currentList?.icon}</span>
          <div className="list-info">
            <div className="list-name">{currentList?.name || 'Select a list'}</div>
            <div className="list-stats">{uncheckedItems.length} items • {checkedItems.length} completed</div>
          </div>
          <ChevronDown className={`chevron-icon ${showListSelector ? 'open' : ''}`} size={20} />
        </button>
        
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
                <div 
                  className="list-option-icon" 
                  style={{ backgroundColor: list.color }}
                >
                  {list.icon}
                </div>
                <div className="list-option-info">
                  <div className="list-option-name">{list.name}</div>
                  <div className="list-option-count">{list.itemCount} items</div>
                </div>
                {currentList?.id === list.id && (
                  <button
                    className="delete-list-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this list?')) {
                        deleteList(list.id);
                        setShowListSelector(false);
                      }
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </button>
            ))}
            <button
              className="list-option new-list-btn"
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
        
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${sortByCategory ? 'active' : ''}`}
              onClick={() => setSortByCategory(true)}
              title="Sort by store sections"
            >
              <Grid3x3 size={16} />
              Categories
            </button>
            <button
              className={`view-toggle-btn ${!sortByCategory ? 'active' : ''}`}
              onClick={() => setSortByCategory(false)}
              title="Show as list"
            >
              <List size={16} />
              List
            </button>
          </div>
          <button
            className="add-item-btn"
            onClick={() => setShowAddItem(!showAddItem)}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {showAddItem && currentList && (
        <form onSubmit={handleAddItem} className="add-item-form">
          <ProductSuggestion
            value={itemName}
            onChange={setItemName}
            onProductSelect={handleProductSelect}
            placeholder="Search for items..."
            className="product-input"
          />
          <div className="add-item-actions">
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
              disabled={!itemName.trim()}
            >
              Add Item
            </button>
          </div>
        </form>
      )}

      {currentList && (
        <SmartSuggestions
          currentItems={uncheckedItems.map(item => item.name)}
          onProductSelect={handleSmartSuggestionSelect}
          isLoading={false}
        />
      )}

      <div className="items-container">
        {uncheckedItems.length === 0 && checkedItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p className="empty-title">Your list is empty</p>
            <p className="empty-subtitle">Tap + to add items</p>
          </div>
        )}

        {sortByCategory && groupedUncheckedItems.map(({ category, items }) => (
          <div key={category} className="category-section">
            <div 
              className="category-header"
              onClick={() => toggleCategory(category)}
            >
              <div className="category-title">
                {expandedCategories.has(category) ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                {category}
              </div>
              <span className="category-count">{items.length}</span>
            </div>
            <div className={`category-items ${expandedCategories.has(category) ? 'expanded' : 'collapsed'}`}>
              {items.map((item) => {
                const comments = getItemComments(item.id);
                const hasComments = comments.length > 0;
                const showCommentInput = expandedComments.has(item.id);
                
                return (
                  <div key={item.id} className="shopping-item">
                    <div className="item-main">
                      <div className="checkbox-wrapper">
                        <button
                          className="checkbox"
                          onClick={() => toggleItemCheck(item.id)}
                        >
                          {/* Check icon will appear when checked via CSS */}
                        </button>
                      </div>
                      
                      <div className="item-details">
                        <div className="item-header">
                          <span className="item-name">{item.name}</span>
                          <div className="item-actions">
                            <div className="quantity-controls">
                              <button
                                className="qty-btn"
                                onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="quantity">{item.quantity}</span>
                              <button
                                className="qty-btn"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              className={`action-btn ${item.likedBy.includes(currentUser?.id || '') ? 'liked' : ''}`}
                              onClick={() => toggleItemLike(item.id)}
                            >
                              <Heart size={14} />
                              {item.likedBy.length > 0 && <span className="like-count">{item.likedBy.length}</span>}
                            </button>
                            <button
                              className={`action-btn comment-btn ${hasComments || showCommentInput ? 'active' : ''}`}
                              onClick={() => toggleComments(item.id)}
                            >
                              <MessageCircle size={14} />
                              {hasComments && <span className="comment-count">{comments.length}</span>}
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => deleteShoppingItem(item.id)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="item-meta">
                          <div className="added-by">
                            <span className="user-avatar">{item.addedByAvatar}</span>
                            <span>{item.addedByName}</span>
                          </div>
                          {item.points && (
                            <div className="item-points">
                              <Star size={10} />
                              <span>{item.points * item.quantity} pts</span>
                            </div>
                          )}
                        </div>
                        {item.tags && <ProductTags tags={item.tags} size="small" maxTags={2} />}
                        
                        {/* Compact Comments Section */}
                        {showCommentInput && (
                          <div className="comments-section-compact">
                            {hasComments && (
                              <div className="comments-list-compact">
                                {comments.map((comment) => (
                                  <div key={comment.id} className="comment-compact">
                                    <span className="comment-avatar-small">{comment.userAvatar}</span>
                                    <span className="comment-text-compact">{comment.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="comment-input-compact">
                              <input
                                type="text"
                                className="comment-input-field"
                                placeholder="Add comment..."
                                value={commentTexts[item.id] || ''}
                                onChange={(e) => setCommentTexts({ ...commentTexts, [item.id]: e.target.value })}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddComment(item.id);
                                  }
                                }}
                              />
                              <button
                                className="comment-send-btn-compact"
                                onClick={() => handleAddComment(item.id)}
                                disabled={!commentTexts[item.id]?.trim()}
                              >
                                <Send size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!sortByCategory && uncheckedItems.map((item) => {
          const comments = getItemComments(item.id);
          const hasComments = comments.length > 0;
          const showCommentInput = expandedComments.has(item.id);
          
          return (
            <div key={item.id} className="shopping-item">
              <div className="item-main">
                <div className="checkbox-wrapper">
                  <button
                    className="checkbox"
                    onClick={() => toggleItemCheck(item.id)}
                  >
                    {/* Check icon will appear when checked via CSS */}
                  </button>
                </div>
                
                <div className="item-details">
                  <div className="item-header">
                    <span className="item-name">{item.name}</span>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className={`action-btn ${item.likedBy.includes(currentUser?.id || '') ? 'liked' : ''}`}
                        onClick={() => toggleItemLike(item.id)}
                      >
                        <Heart size={14} />
                        {item.likedBy.length > 0 && <span className="like-count">{item.likedBy.length}</span>}
                      </button>
                      <button
                        className={`action-btn comment-btn ${hasComments || showCommentInput ? 'active' : ''}`}
                        onClick={() => toggleComments(item.id)}
                      >
                        <MessageCircle size={14} />
                        {hasComments && <span className="comment-count">{comments.length}</span>}
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteShoppingItem(item.id)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-meta">
                    <div className="added-by">
                      <span className="user-avatar">{item.addedByAvatar}</span>
                      <span>{item.addedByName}</span>
                    </div>
                    {item.points && (
                      <div className="item-points">
                        <Star size={10} />
                        <span>{item.points * item.quantity} pts</span>
                      </div>
                    )}
                  </div>
                  {item.tags && <ProductTags tags={item.tags} size="small" maxTags={2} />}
                  
                  {/* Compact Comments Section */}
                  {showCommentInput && (
                    <div className="comments-section-compact">
                      {hasComments && (
                        <div className="comments-list-compact">
                          {comments.map((comment) => (
                            <div key={comment.id} className="comment-compact">
                              <span className="comment-avatar-small">{comment.userAvatar}</span>
                              <span className="comment-text-compact">{comment.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="comment-input-compact">
                        <input
                          type="text"
                          className="comment-input-field"
                          placeholder="Add comment..."
                          value={commentTexts[item.id] || ''}
                          onChange={(e) => setCommentTexts({ ...commentTexts, [item.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(item.id);
                            }
                          }}
                        />
                        <button
                          className="comment-send-btn-compact"
                          onClick={() => handleAddComment(item.id)}
                          disabled={!commentTexts[item.id]?.trim()}
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {checkedItems.length > 0 && (
          <div className="completed-section">
            <div className="completed-header">Completed ({checkedItems.length})</div>
            {checkedItems.map((item) => {
              return (
                <div key={item.id} className="shopping-item checked">
                  <div className="item-main">
                    <div className="checkbox-wrapper">
                      <button
                        className="checkbox checked"
                        onClick={() => toggleItemCheck(item.id)}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                    
                    <div className="item-details">
                      <div className="item-header">
                        <span className="item-name">{item.name}</span>
                        <div className="item-actions">
                          <span className="quantity">×{item.quantity}</span>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => deleteShoppingItem(item.id)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreateList && (
        <div className="modal-overlay" onClick={() => setShowCreateList(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Create New List</h3>
            <form onSubmit={handleCreateList} className="modal-form">
              <div className="form-group">
                <label className="form-label">List Name</label>
                <input
                  type="text"
                  placeholder="Enter list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="input"
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Icon</label>
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
              
              <div className="form-group">
                <label className="form-label">Color</label>
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
                <button type="button" onClick={() => setShowCreateList(false)} className="modal-btn modal-btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="modal-btn modal-btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 