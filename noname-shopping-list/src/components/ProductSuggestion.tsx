import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { Search, Star } from 'lucide-react';
import { searchProducts } from '../data/products';
import { ProductTags } from './ProductTags';

interface ProductSuggestionProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect?: (product: Product) => void;
  placeholder?: string;
  className?: string;
}



export const ProductSuggestion: React.FC<ProductSuggestionProps> = ({
  value,
  onChange,
  onProductSelect,
  placeholder = "Enter product name...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = searchProducts(value, 8);
      setFilteredProducts(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredProducts([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleProductSelect(filteredProducts[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleProductSelect = (product: Product) => {
    onChange(product.name);
    onProductSelect?.(product);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div className={`product-suggestion ${className}`} ref={dropdownRef}>
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input product-input"
          autoComplete="off"
        />
        <Search className="search-icon" size={16} />
      </div>

      {isOpen && filteredProducts.length > 0 && (
        <div className="suggestions-dropdown">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleProductSelect(product)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-description">{product.description}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  {product.brand && (
                    <div className="product-brand">{product.brand}</div>
                  )}
                  {product.points && (
                    <div className="product-points-badge">
                      <Star size={12} />
                      {product.points} pts
                    </div>
                  )}
                </div>
                {product.tags && <ProductTags tags={product.tags} size="small" maxTags={3} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 