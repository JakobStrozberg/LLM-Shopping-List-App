import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Check, X, ShoppingBag, ChevronDown, Heart, MessageCircle, Send, Minus } from 'lucide-react';
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
  } = useStore();
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [showListSelector, setShowListSelector] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [itemName, setItemName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
      <div className="shopping-list-compact">
        <div className="empty-lists-state">
          <ShoppingBag size={48} strokeWidth={1.5} />
          <h2>No shopping lists yet</h2>
          <p>Create your first list to get started</p>
          <button 
            className="btn-primary-compact"
            onClick={() => setShowCreateList(true)}
          >
            <Plus size={18} />
            Create List
          </button>
        </div>
        
        {showCreateList && (
          <div className="modal-overlay" onClick={() => setShowCreateList(false)}>
            <div className="modal-content-compact" onClick={(e) => e.stopPropagation()}>
              <h3>Create New List</h3>
              <form onSubmit={handleCreateList}>
                <input
                  type="text"
                  placeholder="List name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="input-compact"
                  autoFocus
                />
                
                <div className="selector-group">
                  <label>Icon</label>
                  <div className="icon-grid-compact">
                    {LIST_ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-option-compact ${selectedIcon === icon ? 'selected' : ''}`}
                        onClick={() => setSelectedIcon(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="selector-group">
                  <label>Color</label>
                  <div className="color-grid-compact">
                    {LIST_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        className={`color-option-compact ${selectedColor === color.value ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setSelectedColor(color.value)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="modal-actions-compact">
                  <button type="button" onClick={() => setShowCreateList(false)} className="btn-cancel-compact">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-compact">
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
    <div className="shopping-list-compact">
      <div className="list-header-compact">
        <button 
          className="list-selector-compact"
          onClick={() => setShowListSelector(!showListSelector)}
          style={{ borderColor: currentList?.color }}
        >
          <span className="list-icon-compact">{currentList?.icon}</span>
          <span className="list-name-compact">{currentList?.name || 'Select a list'}</span>
          <ChevronDown size={16} className={showListSelector ? 'rotated' : ''} />
        </button>
        
        <button
          className="btn-add-compact"
          onClick={() => setShowAddItem(!showAddItem)}
          style={{ backgroundColor: currentList?.color }}
        >
          <Plus size={20} />
        </button>
      </div>

      {showListSelector && (
        <div className="list-dropdown-compact">
          {familyLists.map(list => (
            <button
              key={list.id}
              className={`list-option-compact ${currentList?.id === list.id ? 'active' : ''}`}
              onClick={() => {
                selectList(list.id);
                setShowListSelector(false);
              }}
            >
              <span className="list-icon-mini">{list.icon}</span>
              <span className="list-name-mini">{list.name}</span>
              <span className="item-count-mini">{list.itemCount}</span>
              {currentList?.id === list.id && (
                <button
                  className="btn-delete-mini"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this list?')) {
                      deleteList(list.id);
                      setShowListSelector(false);
                    }
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </button>
          ))}
          <button
            className="list-option-compact create-new"
            onClick={() => {
              setShowCreateList(true);
              setShowListSelector(false);
            }}
          >
            <Plus size={16} />
            New List
          </button>
        </div>
      )}

      {showAddItem && currentList && (
        <form onSubmit={handleAddItem} className="add-item-form-compact">
          <ProductSuggestion
            value={itemName}
            onChange={setItemName}
            onProductSelect={handleProductSelect}
            placeholder="Add item..."
            className="product-input-compact"
          />
          <div className="form-actions-compact">
            <button type="button" onClick={() => {
              setShowAddItem(false);
              setItemName('');
              setSelectedProduct(null);
            }} className="btn-text-compact">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-add-submit"
              style={{ backgroundColor: currentList.color }}
              disabled={!itemName.trim()}
            >
              Add
            </button>
          </div>
        </form>
      )}

      <div className="items-container-compact">
        {uncheckedItems.length === 0 && checkedItems.length === 0 && (
          <div className="empty-state-compact">
            <p>Your list is empty</p>
            <p className="hint">Tap + to add items</p>
          </div>
        )}

        {uncheckedItems.map((item) => {
          const comments = getItemComments(item.id);
          return (
            <div key={item.id} className="item-compact">
              <div className="item-content-compact">
                <button
                  className="check-compact"
                  onClick={() => toggleItemCheck(item.id)}
                  style={{ borderColor: currentList?.color }}
                />
                
                <div className="item-main">
                  <span className="item-name-compact">{item.name}</span>
                  <div className="item-meta-compact">
                    <span className="quantity-compact">×{item.quantity}</span>
                    <span className="added-by-compact">{item.addedByAvatar}</span>
                  </div>
                </div>
                
                <div className="item-actions-compact">
                  <button
                    className="qty-btn-compact"
                    onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    className="qty-btn-compact"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    className={`social-btn-compact ${item.likedBy.includes(currentUser?.id || '') ? 'liked' : ''}`}
                    onClick={() => toggleItemLike(item.id)}
                  >
                    <Heart size={14} />
                    {item.likedBy.length > 0 && <span>{item.likedBy.length}</span>}
                  </button>
                  <button
                    className="delete-btn-compact"
                    onClick={() => deleteShoppingItem(item.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              
              {/* Always show comments if they exist */}
              {comments.length > 0 && (
                <div className="comments-compact">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-compact">
                      <span className="comment-avatar-compact">{comment.userAvatar}</span>
                      <span className="comment-text-compact">{comment.text}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Comment input */}
              <div className="comment-input-compact">
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={commentTexts[item.id] || ''}
                  onChange={(e) => handleCommentTextChange(item.id, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment(item.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleAddComment(item.id)}
                  disabled={!commentTexts[item.id]?.trim()}
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {checkedItems.length > 0 && (
          <>
            <div className="section-divider-compact">
              <span>Completed ({checkedItems.length})</span>
            </div>
                         {checkedItems.map((item) => {
               const comments = getItemComments(item.id);
               return (
                 <div key={item.id} className="item-compact checked">
                   <div className="item-content-compact">
                     <button
                       className="check-compact checked"
                       onClick={() => toggleItemCheck(item.id)}
                       style={{ backgroundColor: currentList?.color, borderColor: currentList?.color }}
                     >
                       <Check size={12} color="white" />
                     </button>
                     
                     <div className="item-main">
                       <span className="item-name-compact">{item.name}</span>
                       <div className="item-meta-compact">
                         <span className="quantity-compact">×{item.quantity}</span>
                         <span className="added-by-compact">{item.addedByAvatar}</span>
                       </div>
                     </div>
                     
                     <div className="item-actions-compact">
                       <button
                         className="delete-btn-compact"
                         onClick={() => deleteShoppingItem(item.id)}
                       >
                         <X size={14} />
                       </button>
                     </div>
                   </div>
                   
                   {/* Always show comments if they exist for completed items too */}
                   {comments.length > 0 && (
                     <div className="comments-compact">
                       {comments.map((comment) => (
                         <div key={comment.id} className="comment-compact">
                           <span className="comment-avatar-compact">{comment.userAvatar}</span>
                           <span className="comment-text-compact">{comment.text}</span>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               );
             })}
          </>
        )}
      </div>

      {showCreateList && (
        <div className="modal-overlay" onClick={() => setShowCreateList(false)}>
          <div className="modal-content-compact" onClick={(e) => e.stopPropagation()}>
            <h3>Create New List</h3>
            <form onSubmit={handleCreateList}>
              <input
                type="text"
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="input-compact"
                autoFocus
              />
              
              <div className="selector-group">
                <label>Icon</label>
                <div className="icon-grid-compact">
                  {LIST_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option-compact ${selectedIcon === icon ? 'selected' : ''}`}
                      onClick={() => setSelectedIcon(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="selector-group">
                <label>Color</label>
                <div className="color-grid-compact">
                  {LIST_COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-option-compact ${selectedColor === color.value ? 'selected' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.value)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="modal-actions-compact">
                <button type="button" onClick={() => setShowCreateList(false)} className="btn-cancel-compact">
                  Cancel
                </button>
                <button type="submit" className="btn-primary-compact">
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