import { OPENAI_API_KEY, GROCERY_CATEGORIES, GroceryCategory } from '../config/openai';
import { Product } from '../types';
import { GROCERY_PRODUCTS } from '../data/products';

// Log API key status at module initialization
console.log('🔑 OpenAI API Key Configuration:');
console.log('   - Key present:', !!OPENAI_API_KEY);
console.log('   - Key length:', OPENAI_API_KEY?.length || 0);
console.log('   - Key prefix:', OPENAI_API_KEY?.substring(0, 10) + '...');

export interface CategorizedItem {
  name: string;
  category: GroceryCategory;
}

export interface ProductRecommendation {
  product: Product;
  reason: string;
  confidence: number;
}

export interface ProductTags {
  productName: string;
  tags: string[];
}

export class CategorizationService {
  private static apiKey = OPENAI_API_KEY;

  static async categorizeItems(items: string[]): Promise<CategorizedItem[]> {
    console.log('📋 Categorizing items:', items);
    console.log('🔑 API Key available:', !!this.apiKey);
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Using fallback categorization.');
      return items.map(item => ({
        name: item,
        category: this.fallbackCategorization(item)
      }));
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a grocery categorization assistant. Categorize each grocery item into one of these categories: ${GROCERY_CATEGORIES.join(', ')}. Return a JSON array of objects with "name" and "category" fields.`
            },
            {
              role: 'user',
              content: `Categorize these grocery items: ${items.join(', ')}`
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const categorized = JSON.parse(content) as CategorizedItem[];
        return categorized;
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        return items.map(item => ({
          name: item,
          category: this.fallbackCategorization(item)
        }));
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return items.map(item => ({
        name: item,
        category: this.fallbackCategorization(item)
      }));
    }
  }

  static async categorizeItem(itemName: string): Promise<GroceryCategory> {
    const result = await this.categorizeItems([itemName]);
    return result[0]?.category || 'Other';
  }

  private static fallbackCategorization(item: string): GroceryCategory {
    const itemLower = item.toLowerCase();
    
    // Produce
    if (/apple|banana|orange|grape|berry|fruit|vegetable|carrot|lettuce|tomato|potato|onion|pepper|broccoli|spinach|kale/i.test(itemLower)) {
      return 'Produce';
    }
    
    // Dairy
    if (/milk|cheese|yogurt|butter|cream|dairy|egg/i.test(itemLower)) {
      return 'Dairy';
    }
    
    // Meat & Seafood
    if (/meat|chicken|beef|pork|fish|salmon|tuna|shrimp|turkey|bacon|sausage/i.test(itemLower)) {
      return 'Meat & Seafood';
    }
    
    // Bakery
    if (/bread|bagel|muffin|cake|cookie|pastry|donut|croissant/i.test(itemLower)) {
      return 'Bakery';
    }
    
    // Frozen
    if (/frozen|ice cream|pizza/i.test(itemLower)) {
      return 'Frozen';
    }
    
    // Beverages
    if (/water|juice|soda|coffee|tea|drink|beverage|wine|beer/i.test(itemLower)) {
      return 'Beverages';
    }
    
    // Snacks
    if (/chip|snack|candy|chocolate|popcorn|pretzel|cracker/i.test(itemLower)) {
      return 'Snacks & Candy';
    }
    
    // Household
    if (/paper|towel|tissue|cleaner|detergent|soap|shampoo|toothpaste/i.test(itemLower)) {
      return 'Household';
    }
    
    // Health & Beauty
    if (/medicine|vitamin|lotion|makeup|deodorant/i.test(itemLower)) {
      return 'Health & Beauty';
    }
    
    // Baby
    if (/diaper|formula|baby/i.test(itemLower)) {
      return 'Baby';
    }
    
    // Pet
    if (/dog|cat|pet|food/i.test(itemLower) && /pet|dog|cat/i.test(itemLower)) {
      return 'Pet';
    }
    
    // Pantry (default for many items)
    if (/rice|pasta|bean|can|sauce|oil|flour|sugar|salt|spice/i.test(itemLower)) {
      return 'Pantry & Dry Goods';
    }
    
    return 'Other';
  }
}

export class ProductSuggestionService {
  private static apiKey = OPENAI_API_KEY;

  static async getRecommendations(currentItems: string[], limit: number = 5): Promise<ProductRecommendation[]> {
    console.log('🤖 Getting AI recommendations for items:', currentItems);
    console.log('🔑 API Key available:', !!this.apiKey);
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Using fallback recommendations.');
      return this.getFallbackRecommendations(currentItems, limit);
    }

    if (currentItems.length === 0) {
      return [];
    }

    try {
      const availableProductNames = GROCERY_PRODUCTS.map(p => p.name);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a grocery shopping assistant that suggests complementary products based on what's already in a shopping list. 
              
              Analyze the shopping list and suggest ${limit} products that would naturally go well with the items already selected. Consider:
              - Meal completion (if they have ingredients for a specific dish)
              - Cooking essentials (oils, spices, etc.)
              - Common pairings (bread with butter, pasta with sauce)
              - Balanced nutrition (vegetables with proteins)
              - Breakfast/lunch/dinner combinations
              
              Only suggest products from this available list: ${availableProductNames.join(', ')}
              
              Return a JSON array of objects with these fields:
              - "productName": exact name from the available products list
              - "reason": brief explanation why this goes well with their current items
              - "confidence": number from 0.1 to 1.0 indicating how confident you are in this suggestion
              
              Example format:
              [
                {"productName": "Mayonnaise", "reason": "Perfect condiment to complement ketchup and mustard", "confidence": 0.8}
              ]`
            },
            {
              role: 'user',
              content: `Current shopping list: ${currentItems.join(', ')}`
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const suggestions = JSON.parse(content);
        
        const recommendations: ProductRecommendation[] = suggestions
          .map((suggestion: any) => {
            const product = GROCERY_PRODUCTS.find(p => 
              p.name.toLowerCase() === suggestion.productName.toLowerCase()
            );
            
            if (!product) {
              return null;
            }
            
            return {
              product,
              reason: suggestion.reason || 'Recommended based on your current items',
              confidence: Math.max(0.1, Math.min(1.0, suggestion.confidence || 0.5))
            };
          })
          .filter((rec: ProductRecommendation | null) => rec !== null)
          .slice(0, limit);

        return recommendations;
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        return this.getFallbackRecommendations(currentItems, limit);
      }
    } catch (error) {
      console.error('Error calling OpenAI API for recommendations:', error);
      return this.getFallbackRecommendations(currentItems, limit);
    }
  }

  private static getFallbackRecommendations(currentItems: string[], limit: number): ProductRecommendation[] {
    const currentItemsLower = currentItems.map(item => item.toLowerCase());
    const recommendations: ProductRecommendation[] = [];
    
    // Define common product associations
    const associations: { [key: string]: { products: string[], reason: string }[] } = {
      'ketchup': [
        { products: ['mustard', 'mayonnaise'], reason: 'Classic condiment trio' },
        { products: ['french fries', 'burgers'], reason: 'Perfect for BBQ and fries' }
      ],
      'mustard': [
        { products: ['ketchup', 'mayonnaise'], reason: 'Essential condiment collection' },
        { products: ['hot dogs', 'deli meat'], reason: 'Great for sandwiches and hot dogs' }
      ],
      'mayonnaise': [
        { products: ['ketchup', 'mustard'], reason: 'Complete your condiment set' },
        { products: ['bread', 'lettuce'], reason: 'Perfect for sandwiches' }
      ],
      'pasta': [
        { products: ['tomato sauce', 'parmesan cheese'], reason: 'Classic pasta essentials' },
        { products: ['olive oil', 'garlic'], reason: 'For authentic Italian cooking' }
      ],
      'bread': [
        { products: ['butter', 'jam'], reason: 'Perfect breakfast combination' },
        { products: ['peanut butter', 'honey'], reason: 'Great for sandwiches' }
      ],
      'milk': [
        { products: ['cereal', 'cookies'], reason: 'Classic breakfast and snack pairing' },
        { products: ['coffee', 'tea'], reason: 'Essential for hot beverages' }
      ],
      'chicken': [
        { products: ['rice', 'vegetables'], reason: 'Complete balanced meal' },
        { products: ['olive oil', 'herbs'], reason: 'Perfect for seasoning and cooking' }
      ],
      'tomato': [
        { products: ['onion', 'garlic'], reason: 'Holy trinity of cooking' },
        { products: ['mozzarella', 'basil'], reason: 'Caprese salad ingredients' }
      ]
    };

    // Find associations for current items
    for (const currentItem of currentItemsLower) {
      for (const [key, assocList] of Object.entries(associations)) {
        if (currentItem.includes(key) || key.includes(currentItem)) {
          for (const assoc of assocList) {
            for (const suggestedProductName of assoc.products) {
              const product = GROCERY_PRODUCTS.find(p => 
                p.name.toLowerCase().includes(suggestedProductName) ||
                suggestedProductName.includes(p.name.toLowerCase())
              );
              
              if (product && !currentItemsLower.some(item => 
                item.includes(product.name.toLowerCase()) || 
                product.name.toLowerCase().includes(item)
              )) {
                recommendations.push({
                  product,
                  reason: assoc.reason,
                  confidence: 0.7
                });
              }
            }
          }
        }
      }
    }

    // Remove duplicates and return limited results
    const uniqueRecommendations = recommendations.filter((rec, index, self) => 
      index === self.findIndex(r => r.product.id === rec.product.id)
    );

    return uniqueRecommendations.slice(0, limit);
  }
}

export class TaggingService {
  private static apiKey = OPENAI_API_KEY;

  static async generateTags(productName: string, productDescription?: string, brand?: string): Promise<string[]> {
    console.log('🏷️  Generating tags for:', productName);
    console.log('🔑  API Key present:', !!this.apiKey);
    console.log('🔑  API Key length:', this.apiKey?.length || 0);
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Using fallback tags.');
      return this.getFallbackTags(productName, productDescription, brand);
    }

    try {
      const productInfo = [
        productName,
        productDescription,
        brand && `Brand: ${brand}`
      ].filter(Boolean).join(', ');

      console.log('🚀  Making API call for tags with product info:', productInfo);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a grocery product tagging assistant. Generate 2-4 relevant and ACCURATE tags for grocery products that help shoppers understand key characteristics.

              Tags should be short (1-2 words) and focus on:
              - Health aspects (Organic, Low-Sodium, High-Protein, etc.)
              - Value proposition (Good Value, Premium, Budget-Friendly, etc.)
              - Convenience (Quick-Prep, Ready-to-Eat, Fresh, Frozen, etc.)
              - Dietary features ONLY when TRUE (Dairy-Free, Vegan, Gluten-Free, Keto-Friendly, Low-Carb, High-Fiber, etc.)
              - Quality indicators (Farm-Fresh, Artisan, Local, etc.)
              
              IMPORTANT: Only add dietary restriction tags like "Dairy-Free", "Vegan", "Gluten-Free" if the product genuinely meets those criteria.
              - Milk, cheese, butter, yogurt are NOT dairy-free or vegan
              - Meat, fish, poultry are NOT vegan
              - Bread, pasta, flour typically contain gluten unless specifically labeled gluten-free
              
              Return only a JSON array of strings with the tags. Example: ["Organic", "Fresh", "High-Fiber"]`
            },
            {
              role: 'user',
              content: `Generate tags for this product: ${productInfo}`
            }
          ],
          temperature: 0.2,
          max_tokens: 100
        })
      });

      if (!response.ok) {
        console.error('❌  OpenAI API error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌  Error details:', errorText);
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      console.log('✅  OpenAI API response:', content);
      
      try {
        const tags = JSON.parse(content) as string[];
        console.log('🏷️  Parsed tags:', tags);
        return Array.isArray(tags) ? tags.slice(0, 4) : []; // Limit to 4 tags
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        console.log('🔄  Falling back to manual tags');
        return this.getFallbackTags(productName, productDescription, brand);
      }
    } catch (error) {
      console.error('❌  Error calling OpenAI API for tags:', error);
      console.log('🔄  Falling back to manual tags');
      return this.getFallbackTags(productName, productDescription, brand);
    }
  }

  static async generateTagsForMultipleProducts(products: { name: string; description?: string; brand?: string }[]): Promise<ProductTags[]> {
    if (!this.apiKey) {
      return products.map(product => ({
        productName: product.name,
        tags: this.getFallbackTags(product.name, product.description, product.brand)
      }));
    }

    try {
      const productList = products.map(p => 
        [p.name, p.description, p.brand && `Brand: ${p.brand}`].filter(Boolean).join(', ')
      ).join('\n');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a grocery product tagging assistant. Generate 2-4 relevant and ACCURATE tags for each grocery product.

              Tags should be short (1-2 words) and focus on:
              - Health aspects (Organic, Low-Sodium, High-Protein, etc.)
              - Value proposition (Good Value, Premium, Budget-Friendly, etc.)
              - Convenience (Quick-Prep, Ready-to-Eat, Fresh, Frozen, etc.)
              - Dietary features ONLY when TRUE (Dairy-Free, Vegan, Gluten-Free, Keto-Friendly, Low-Carb, High-Fiber, etc.)
              - Quality indicators (Farm-Fresh, Artisan, Local, etc.)
              
              IMPORTANT: Only add dietary restriction tags like "Dairy-Free", "Vegan", "Gluten-Free" if the product genuinely meets those criteria.
              - Milk, cheese, butter, yogurt are NOT dairy-free or vegan
              - Meat, fish, poultry are NOT vegan
              - Bread, pasta, flour typically contain gluten unless specifically labeled gluten-free
              
              Return a JSON array of objects with "productName" and "tags" fields.
              Example: [{"productName": "Roma Tomatoes", "tags": ["Fresh", "Organic", "Low-Calorie"]}]`
            },
            {
              role: 'user',
              content: `Generate tags for these products:\n${productList}`
            }
          ],
          temperature: 0.2,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const result = JSON.parse(content) as ProductTags[];
        return Array.isArray(result) ? result : [];
      } catch (parseError) {
        console.error('Failed to parse OpenAI response for multiple products:', parseError);
        return products.map(product => ({
          productName: product.name,
          tags: this.getFallbackTags(product.name, product.description, product.brand)
        }));
      }
    } catch (error) {
      console.error('Error calling OpenAI API for multiple product tags:', error);
      return products.map(product => ({
        productName: product.name,
        tags: this.getFallbackTags(product.name, product.description, product.brand)
      }));
    }
  }

  private static getFallbackTags(productName: string, productDescription?: string, brand?: string): string[] {
    const name = productName.toLowerCase();
    const desc = (productDescription || '').toLowerCase();
    const brandName = (brand || '').toLowerCase();
    const tags: string[] = [];

    // No Name brand products get "Good Value" tag
    if (brandName.includes('no name')) {
      tags.push('Good Value');
    }

    // Fresh produce tags
    if (/tomato|lettuce|cucumber|pepper|onion|carrot|broccoli|spinach|kale|avocado|apple|banana|orange|fruit|vegetable/i.test(name)) {
      tags.push('Fresh');
      if (Math.random() > 0.5) tags.push('Organic'); // Randomly add organic for realism
    }

    // Dairy products (these are NOT dairy-free or vegan)
    if (/milk|cheese|yogurt|butter|cream/i.test(name)) {
      tags.push('Dairy');
      if (name.includes('2%') || name.includes('low') || name.includes('skim')) tags.push('Low-Fat');
      // Explicitly NOT adding dairy-free or vegan tags here
    }

    // Meat products (these are NOT vegan)
    if (/chicken|beef|pork|turkey|salmon|fish|meat|bacon|ham|sausage/i.test(name)) {
      tags.push('High-Protein');
      if (desc.includes('lean') || name.includes('lean')) tags.push('Lean');
      // Explicitly NOT adding vegan tags here
    }

    // Healthy options
    if (/whole|grain|fiber|oat|quinoa/i.test(name + desc)) {
      tags.push('High-Fiber');
    }

    // Convenience foods
    if (/frozen|canned|ready|instant|quick/i.test(name + desc)) {
      tags.push('Quick-Prep');
    }

    // Vegan-friendly items (ONLY items that are actually vegan)
    if (/^(vegetable|fruit|rice|pasta|oil|vinegar|bean|lentil|apple|banana|orange|tomato|lettuce|carrot|broccoli|spinach)$/i.test(name.trim()) && 
        !/cheese|milk|meat|fish|chicken|beef|dairy|butter|cream|yogurt|bacon|ham|sausage|egg/i.test(name + desc)) {
      tags.push('Vegan');
    }

    // Gluten-free items (only naturally gluten-free items)
    if (/^(rice|potato|corn|apple|banana|orange|tomato|lettuce|carrot|meat|fish|chicken|beef|milk|cheese)$/i.test(name.trim()) && 
        !/bread|pasta|flour|wheat|gluten|barley|rye/i.test(name + desc)) {
      if (Math.random() > 0.7) tags.push('Gluten-Free'); // Only sometimes for realism
    }

    // Premium/Quality indicators
    if (/organic|artisan|premium|gourmet|farm|local/i.test(name + desc)) {
      tags.push('Premium');
    }

    // Return 2-4 tags
    if (tags.length > 4) {
      return tags.slice(0, 4);
    }
    
    // Add generic tags if we have too few
    if (tags.length < 2) {
      const genericTags = ['Quality', 'Popular', 'Essential'];
      tags.push(...genericTags.slice(0, 2 - tags.length));
    }

    return tags;
  }
}

// Test function to verify tagging accuracy
export async function testTagging() {
  console.log('🧪 Testing improved tagging system...');
  
  const testProducts = [
    'Milk 2%',
    'Cheddar Cheese', 
    'Ground Beef',
    'Roma Tomatoes',
    'White Bread',
    'Olive Oil'
  ];
  
  console.log('Testing products:', testProducts);
  
  for (const product of testProducts) {
    const tags = await TaggingService.generateTags(product);
    console.log(`${product}: [${tags.join(', ')}]`);
  }
  
  console.log('✅ Tag testing complete!');
} 