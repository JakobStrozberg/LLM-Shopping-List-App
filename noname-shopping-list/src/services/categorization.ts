import { OPENAI_API_KEY, GROCERY_CATEGORIES, GroceryCategory } from '../config/openai';

export interface CategorizedItem {
  name: string;
  category: GroceryCategory;
}

export class CategorizationService {
  private static apiKey = OPENAI_API_KEY;

  static async categorizeItems(items: string[]): Promise<CategorizedItem[]> {
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