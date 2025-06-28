
export const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

export const GROCERY_CATEGORIES = [
  'Produce',
  'Dairy',
  'Meat & Seafood',
  'Bakery',
  'Frozen',
  'Pantry & Dry Goods',
  'Snacks & Candy',
  'Beverages',
  'Health & Beauty',
  'Household',
  'Baby',
  'Pet',
  'Other'
] as const;

export type GroceryCategory = typeof GROCERY_CATEGORIES[number]; 