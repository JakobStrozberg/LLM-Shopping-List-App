import { Product } from '../types';

export const GROCERY_PRODUCTS: Product[] = [
  // These are products with verified working images from the original CSV data
  { id: '20143381001', name: 'Roma Tomatoes', description: 'Fresh Roma tomatoes, sold by weight', image: 'https://assets.shop.loblaws.ca/products/20143381001/b2/en/front/20143381001_front_a06_@2.png', tags: ['Fresh', 'Vegan', 'Low-Calorie'], points: 25 },
  { id: '20070132001', name: 'English Cucumber', description: 'Fresh English cucumber, 1 ea', image: 'https://assets.shop.loblaws.ca/products/20070132001/b2/en/front/20070132001_front_a06_@2.png', tags: ['Fresh', 'Hydrating', 'Low-Carb'], points: 20 },
  { id: '20107500001', name: 'Green Onion', description: 'Fresh green onion bunch', image: 'https://assets.shop.loblaws.ca/products/20107500001/b2/en/front/20107500001_front_a06_@2.png', tags: ['Fresh', 'Flavorful', 'Organic'], points: 15 },
  { id: '20145621001', name: 'Broccoli', description: 'Fresh broccoli crown, 1 ea', image: 'https://assets.shop.loblaws.ca/products/20145621001/b2/en/front/20145621001_front_a06_@2.png', tags: ['Fresh', 'High-Fiber', 'Vitamin-Rich'], points: 30 },
  { id: '20007535001', name: 'Red Peppers', description: 'Fresh red bell peppers, sold by weight', image: 'https://assets.shop.loblaws.ca/products/20007535001/b2/en/front/20007535001_front_a06_@2.png', tags: ['Fresh', 'Vitamin C', 'Colorful'], points: 25 },
  { id: '20811994001', name: 'Yellow Onions', description: 'Yellow onions, 3 lb bag', image: 'https://assets.shop.loblaws.ca/products/20811994001/b2/en/front/20811994001_front_a06_@2.png', points: 35 },
  { id: '20163119001', name: 'Celery Stalks', description: 'Fresh celery stalks, 1 ea', image: 'https://assets.shop.loblaws.ca/products/20163119001/b2/en/front/20163119001_front_a06_@2.png', points: 20 },
  { id: '20135326001', name: 'Lettuce Iceberg', description: 'Fresh iceberg lettuce head, 1 ea', image: 'https://assets.shop.loblaws.ca/products/20135326001/b2/en/front/20135326001_front_a06_@2.png', points: 25 },
  { id: '20134101001', name: 'Red Onion', description: 'Fresh red onions, sold by weight', image: 'https://assets.shop.loblaws.ca/products/20134101001/b2/en/front/20134101001_front_a06_@2.png', points: 20 },
  { id: '20135377001', name: 'Cauliflower', description: 'Fresh cauliflower head, 1 ea', image: 'https://assets.shop.loblaws.ca/products/20135377001/b2/en/front/20135377001_front_a06_@2.png', points: 30 },
  { id: '20425893001', name: 'Sweet Green Peppers', description: 'Fresh green bell peppers, sold by weight', image: 'https://assets.shop.loblaws.ca/products/20425893001/b2/en/front/20425893001_front_a06_@2.png' },
  { id: '20426596001', name: 'Zucchini', description: 'Fresh zucchini, sold by weight', image: 'https://assets.shop.loblaws.ca/products/20426596001/b2/en/front/20426596001_front_a06_@2.png' },
  { id: '21004355001', name: 'Garlic Bulbs', description: 'Fresh garlic bulbs, 3-count pack', image: 'https://assets.shop.loblaws.ca/products/21004355001/b2/en/front/21004355001_front_a06_@2.png' },
  { id: '20179038001', name: 'Ginger', description: 'Fresh ginger root, sold by weight', image: 'https://assets.shop.loblaws.ca/products/20179038001/b2/en/front/20179038001_front_a06_@2.png' },
  { id: '21035960001', name: 'Mini Cucumbers', description: 'Mini cucumbers, 15-pack', image: 'https://assets.shop.loblaws.ca/products/21035960001/b2/en/front/21035960001_front_a06_@2.png' },
  { id: '20600997001', name: 'White Potatoes', description: 'White potatoes, 10 lb bag', image: 'https://assets.shop.loblaws.ca/products/20600997001/b2/en/front/20600997001_front_a06_@2.png' },
  { id: '20127708001', name: 'Sweet Potato', description: 'Fresh sweet potatoes, sold by weight', image: 'https://assets.shop.loblaws.ca/products/20127708001/b2/en/front/20127708001_front_a06_@2.png' },
  { id: '21367888001', name: 'Grape Tomatoes', description: 'Fresh grape tomatoes, 283g container', image: 'https://assets.shop.loblaws.ca/products/21367888001/b2/en/front/21367888001_front_a06_@2.png' },
  { id: '20083454001', name: 'Sweet Onion', description: 'Fresh sweet onions, sold by weight', image: 'https://assets.shop.loblaws.ca/products/20083454001/b2/en/front/20083454001_front_a06_@2.png' },
  { id: '20065036001', name: 'Romaine Lettuce', description: 'Fresh romaine lettuce head, 1 ea', image: 'https://assets.shop.loblaws.ca/products/20065036001/b2/en/front/20065036001_front_a06_@2.png' },
  
  // Products without images (but still searchable)
  { id: 'milk-2', name: 'Milk 2%', description: 'Partly skimmed milk, 4L jug', brand: 'No Name', tags: ['Good Value', 'Low-Fat', 'Dairy'], points: 50 },
  { id: 'eggs', name: 'Large White Eggs', description: 'Large white eggs, 12 count', brand: 'No Name', tags: ['Good Value', 'High-Protein', 'Fresh'], points: 45 },
  { id: 'bread', name: 'White Bread', description: 'White sandwich bread, 675g loaf', brand: 'No Name', tags: ['Good Value', 'Pantry', 'Daily'], points: 40 },
  { id: 'butter', name: 'Butter', description: 'Salted butter, 454g', brand: 'No Name', tags: ['Good Value', 'Dairy', 'Cooking'], points: 55 },
  { id: 'cheese', name: 'Cheddar Cheese', description: 'Medium cheddar cheese, 400g block', brand: 'No Name', tags: ['Good Value', 'High-Protein', 'Dairy'], points: 60 },
  { id: 'chicken', name: 'Chicken Breast', description: 'Boneless skinless chicken breast, fresh', brand: 'No Name' },
  { id: 'beef', name: 'Ground Beef', description: 'Lean ground beef, fresh', brand: 'No Name' },
  { id: 'pasta', name: 'Spaghetti', description: 'Spaghetti pasta, 900g box', brand: 'No Name' },
  { id: 'rice', name: 'White Rice', description: 'Long grain white rice, 2kg bag', brand: 'No Name' },
  { id: 'sauce', name: 'Pasta Sauce', description: 'Tomato pasta sauce, 680ml jar', brand: 'No Name' },
  { id: 'oil', name: 'Olive Oil', description: 'Extra virgin olive oil, 1L bottle', brand: 'No Name' },
  { id: 'flour', name: 'All Purpose Flour', description: 'All purpose flour, 2.5kg bag', brand: 'No Name' },
  { id: 'sugar', name: 'White Sugar', description: 'Granulated white sugar, 2kg bag', brand: 'No Name' },
  { id: 'bananas', name: 'Bananas', description: 'Fresh bananas, sold by weight' },
  { id: 'apples', name: 'Fuji Apples', description: 'Fresh Fuji apples, sold by weight' },
  { id: 'oranges', name: 'Oranges', description: 'Fresh oranges, sold by weight' },
  { id: 'grapes', name: 'Green Grapes', description: 'Fresh seedless green grapes, sold by weight' },
  { id: 'strawberries', name: 'Strawberries', description: 'Fresh strawberries, 1 lb container' },
  { id: 'yogurt', name: 'Plain Yogurt', description: 'Plain yogurt, 750g container', brand: 'No Name' },
  { id: 'bacon', name: 'Bacon', description: 'Sliced bacon, 375g', brand: 'No Name' },
  { id: 'salmon', name: 'Salmon Fillets', description: 'Atlantic salmon fillets, fresh' },
  { id: 'chips', name: 'Potato Chips', description: 'Regular potato chips, 200g bag', brand: 'No Name' },
  { id: 'cookies', name: 'Chocolate Chip Cookies', description: 'Chocolate chip cookies, 300g package', brand: 'No Name' },
  { id: 'juice', name: 'Orange Juice', description: 'Orange juice, 1.75L carton', brand: 'No Name' },
  { id: 'water', name: 'Bottled Water', description: 'Spring water, 24x500ml bottles', brand: 'No Name' },
  { id: 'pizza', name: 'Frozen Pizza', description: 'Pepperoni frozen pizza, 330g', brand: 'No Name' },
  { id: 'ice-cream', name: 'Ice Cream', description: 'Vanilla ice cream, 1.5L tub', brand: 'No Name' },
  { id: 'toilet-paper', name: 'Toilet Paper', description: 'Toilet paper, 12 double rolls', brand: 'No Name' },
  { id: 'paper-towels', name: 'Paper Towels', description: 'Paper towels, 6 rolls', brand: 'No Name' },
  { id: 'dish-soap', name: 'Dish Soap', description: 'Dish detergent, 740ml bottle', brand: 'No Name' },
  { id: 'carrots', name: 'Carrots', description: 'Fresh carrots, 5 lb bag' },
  { id: 'avocados', name: 'Avocados', description: 'Fresh avocados, each' },
  { id: 'blueberries', name: 'Blueberries', description: 'Fresh blueberries, pint container' },
  { id: 'lemons', name: 'Lemons', description: 'Fresh lemons, each' },
  { id: 'limes', name: 'Limes', description: 'Fresh limes, each' },
  { id: 'mushrooms', name: 'White Mushrooms', description: 'Fresh white mushrooms, 227g' },
  { id: 'spinach', name: 'Baby Spinach', description: 'Fresh baby spinach, 142g container' },
  { id: 'kale', name: 'Kale', description: 'Fresh kale bunch' },
  { id: 'corn', name: 'Corn on the Cob', description: 'Fresh corn on the cob, each' },
  { id: 'beans', name: 'Green Beans', description: 'Fresh green beans, sold by weight' },
  { id: 'pork', name: 'Pork Chops', description: 'Boneless pork chops, fresh', brand: 'No Name' },
  { id: 'turkey', name: 'Ground Turkey', description: 'Lean ground turkey, fresh', brand: 'No Name' },
  { id: 'ham', name: 'Sliced Ham', description: 'Deli sliced ham, 175g', brand: 'No Name' },
  { id: 'bagels', name: 'Bagels', description: 'Plain bagels, 6 pack', brand: 'No Name' },
  { id: 'muffins', name: 'English Muffins', description: 'English muffins, 6 pack', brand: 'No Name' },
  { id: 'tortillas', name: 'Tortillas', description: 'Flour tortillas, 10 pack', brand: 'No Name' },
  { id: 'cream-cheese', name: 'Cream Cheese', description: 'Cream cheese, 250g brick', brand: 'No Name' },
  { id: 'sour-cream', name: 'Sour Cream', description: 'Sour cream, 500ml container', brand: 'No Name' },
  { id: 'mozzarella', name: 'Mozzarella Cheese', description: 'Mozzarella cheese, 400g block', brand: 'No Name' },
  { id: 'penne', name: 'Penne', description: 'Penne pasta, 900g box', brand: 'No Name' },
  { id: 'tomato-sauce', name: 'Tomato Sauce', description: 'Canned tomato sauce, 680ml', brand: 'No Name' },
  { id: 'soup', name: 'Chicken Noodle Soup', description: 'Canned chicken noodle soup, 284ml', brand: 'No Name' },
  { id: 'cereal', name: 'Corn Flakes', description: 'Corn flakes cereal, 525g box', brand: 'No Name' },
  { id: 'oatmeal', name: 'Quick Oats', description: 'Quick cooking oats, 1kg', brand: 'No Name' },
  { id: 'honey', name: 'Honey', description: 'Liquid honey, 500g bottle', brand: 'No Name' },
  { id: 'peanut-butter', name: 'Peanut Butter', description: 'Smooth peanut butter, 1kg jar', brand: 'No Name' },
  { id: 'jam', name: 'Strawberry Jam', description: 'Strawberry jam, 500ml jar', brand: 'No Name' },
  { id: 'coffee', name: 'Ground Coffee', description: 'Medium roast ground coffee, 930g', brand: 'No Name' },
  { id: 'tea', name: 'Tea Bags', description: 'Orange pekoe tea bags, 100 count', brand: 'No Name' },
  { id: 'ketchup', name: 'Ketchup', description: 'Tomato ketchup, 1L bottle', brand: 'No Name' },
  { id: 'mustard', name: 'Yellow Mustard', description: 'Yellow mustard, 400ml bottle', brand: 'No Name' },
  { id: 'mayo', name: 'Mayonnaise', description: 'Real mayonnaise, 890ml jar', brand: 'No Name' },
  { id: 'vinegar', name: 'White Vinegar', description: 'White vinegar, 1L bottle', brand: 'No Name' },
  { id: 'salt', name: 'Salt', description: 'Table salt, 1kg box', brand: 'No Name' },
  { id: 'pepper', name: 'Black Pepper', description: 'Ground black pepper, 60g', brand: 'No Name' },
  { id: 'canned-tomatoes', name: 'Canned Tomatoes', description: 'Diced tomatoes, 796ml can', brand: 'No Name' },
  { id: 'tuna', name: 'Tuna', description: 'Flaked light tuna, 170g can', brand: 'No Name' },
  { id: 'beans-canned', name: 'Black Beans', description: 'Canned black beans, 540ml', brand: 'No Name' },
  { id: 'corn-canned', name: 'Corn Kernels', description: 'Canned corn kernels, 341ml', brand: 'No Name' },
  { id: 'tissues', name: 'Facial Tissues', description: 'Facial tissues, 6 pack', brand: 'No Name' },
  { id: 'shampoo', name: 'Shampoo', description: '2-in-1 shampoo and conditioner, 700ml', brand: 'No Name' },
  { id: 'soap', name: 'Bar Soap', description: 'Bath soap bars, 8 pack', brand: 'No Name' },
  { id: 'toothpaste', name: 'Toothpaste', description: 'Mint toothpaste, 100ml tube', brand: 'No Name' },
  { id: 'laundry', name: 'Laundry Detergent', description: 'Laundry detergent, 1.47L bottle', brand: 'No Name' },
  { id: 'bleach', name: 'Bleach', description: 'Household bleach, 1.89L bottle', brand: 'No Name' }
];

// Helper function to search products
export function searchProducts(query: string, limit: number = 8): Product[] {
  const searchTerm = query.toLowerCase();
  return GROCERY_PRODUCTS
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm))
    )
    .map(product => ({
      ...product,
      // Add default points based on brand if not specified
      points: product.points || (product.brand === 'No Name' ? 50 : 25)
    }))
    .slice(0, limit);
} 