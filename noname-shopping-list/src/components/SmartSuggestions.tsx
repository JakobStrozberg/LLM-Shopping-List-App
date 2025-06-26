import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Plus, Sparkles, Lightbulb } from 'lucide-react';
import { ProductSuggestionService, ProductRecommendation } from '../services/categorization';
import { Product } from '../types';
import { ProductTags } from './ProductTags';

interface SmartSuggestionsProps {
  currentItems: string[];
  onProductSelect: (product: Product) => void;
  isLoading?: boolean;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  currentItems,
  onProductSelect,
  isLoading = false
}) => {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);

  const loadRecommendations = useCallback(async () => {
    setIsLoadingRecommendations(true);
    try {
      const recs = await ProductSuggestionService.getRecommendations(currentItems, 5);
      setRecommendations(recs);
      if (recs.length > 0 && !isManuallyCollapsed) {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [currentItems, isManuallyCollapsed]);

  useEffect(() => {
    if (currentItems.length > 0 && !isLoading) {
      loadRecommendations();
    } else {
      setRecommendations([]);
      setIsManuallyCollapsed(false);
    }
  }, [currentItems, isLoading, loadRecommendations]);

  const handleAddProduct = (product: Product) => {
    onProductSelect(product);
    // Remove the added product from recommendations
    setRecommendations(prev => prev.filter(rec => rec.product.id !== product.id));
  };

  const handleToggleSuggestions = () => {
    const newShowState = !showSuggestions;
    setShowSuggestions(newShowState);
    setIsManuallyCollapsed(!newShowState);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4CAF50'; // Green for high confidence
    if (confidence >= 0.6) return '#FF9800'; // Orange for medium confidence
    return '#757575'; // Gray for low confidence
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Highly recommended';
    if (confidence >= 0.6) return 'Good match';
    return 'Suggested';
  };

  if (currentItems.length === 0) {
    return (
      <div className="smart-suggestions-empty">
        <div className="suggestion-icon">
          <Brain size={24} color="#9E9E9E" />
        </div>
        <p className="suggestion-text">Add some items to get smart suggestions!</p>
      </div>
    );
  }

  if (isLoadingRecommendations) {
    return (
      <div className="smart-suggestions-loading">
        <div className="suggestion-icon">
          <Brain size={24} color="#4A90E2" className="pulse" />
        </div>
        <p className="suggestion-text">Finding smart suggestions...</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="smart-suggestions-empty">
        <div className="suggestion-icon">
          <Lightbulb size={24} color="#9E9E9E" />
        </div>
        <p className="suggestion-text">No suggestions available at the moment</p>
      </div>
    );
  }

  return (
    <div className="smart-suggestions">
      <div className="suggestions-header" onClick={handleToggleSuggestions}>
        <div className="header-content">
          <Sparkles size={20} color="#4A90E2" />
          <h3 className="suggestions-title">Smart Suggestions</h3>
          <span className="suggestions-count">{recommendations.length}</span>
        </div>
        <span className="toggle-indicator">{showSuggestions ? '−' : '+'}</span>
      </div>

      {showSuggestions && (
        <div className="suggestions-list">
          {recommendations.map((recommendation) => (
            <div key={recommendation.product.id} className="suggestion-item">
              <div className="suggestion-content">
                {recommendation.product.image && (
                  <div className="suggestion-image">
                    <img 
                      src={recommendation.product.image} 
                      alt={recommendation.product.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="suggestion-info">
                  <div className="suggestion-name">
                    {recommendation.product.name}
                  </div>
                  <div className="suggestion-reason">
                    {recommendation.reason}
                  </div>
                  <div 
                    className="suggestion-confidence"
                    style={{ color: getConfidenceColor(recommendation.confidence) }}
                  >
                    {getConfidenceLabel(recommendation.confidence)}
                  </div>
                  {recommendation.product.tags && <ProductTags tags={recommendation.product.tags} size="small" maxTags={3} />}
                </div>
              </div>
              
              <button
                className="suggestion-add-btn"
                onClick={() => handleAddProduct(recommendation.product)}
                title="Add to list"
              >
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 