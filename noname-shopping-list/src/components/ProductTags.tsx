import React from 'react';

interface ProductTagsProps {
  tags: string[];
  size?: 'small' | 'medium' | 'large';
  maxTags?: number;
}

export const ProductTags: React.FC<ProductTagsProps> = ({ 
  tags, 
  size = 'medium',
  maxTags = 4 
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = tags.slice(0, maxTags);
  const hasMoreTags = tags.length > maxTags;

  const getTagColor = (tag: string): string => {
    const tagLower = tag.toLowerCase();
    
    if (/organic|vegan|gluten-free|dairy-free|low-fat|lean|high-fiber|keto/i.test(tagLower)) {
      return '#4CAF50';
    }
    
    if (/good value|budget|premium|quality/i.test(tagLower)) {
      return '#2196F3';
    }
    
    if (/fresh|quick-prep|ready|frozen|instant/i.test(tagLower)) {
      return '#FF9800';
    }
    
    if (/high-protein|protein|nutrient|vitamin/i.test(tagLower)) {
      return '#9C27B0';
    }
    
    return '#757575';
  };

  return (
    <div className={`product-tags product-tags-${size}`}>
      {displayTags.map((tag, index) => (
        <span
          key={index}
          className="product-tag"
          style={{ backgroundColor: getTagColor(tag) }}
        >
          {tag}
        </span>
      ))}
      {hasMoreTags && (
        <span className="product-tag product-tag-more">
          +{tags.length - maxTags}
        </span>
      )}
    </div>
  );
}; 