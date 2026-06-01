export interface Item {
  id: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
  tags: string[];
}

// Sample data - can be restaurants, movies, activities, etc.
export const ITEMS: Item[] = [
  {
    id: '1',
    emoji: '🍕',
    name: 'Pizza Place',
    description: 'Fresh wood-fired pizza with artisan toppings',
    color: '#FF6B35',
    tags: ['Italian', 'Casual'],
  },
  {
    id: '2',
    emoji: '🍣',
    name: 'Sushi Bar',
    description: 'Premium sushi and fresh fish daily',
    color: '#F7931E',
    tags: ['Japanese', 'Upscale'],
  },
  {
    id: '3',
    emoji: '🍔',
    name: 'Burger Grill',
    description: 'Gourmet burgers with craft toppings',
    color: '#C1272D',
    tags: ['American', 'Fast-Casual'],
  },
  {
    id: '4',
    emoji: '🍜',
    name: 'Ramen House',
    description: 'Rich broths and handmade noodles',
    color: '#B8860B',
    tags: ['Japanese', 'Casual'],
  },
  {
    id: '5',
    emoji: '🌮',
    name: 'Taco Truck',
    description: 'Authentic street tacos and fresh salsa',
    color: '#FFB81C',
    tags: ['Mexican', 'Quick'],
  },
  {
    id: '6',
    emoji: '🍝',
    name: 'Italian Trattoria',
    description: 'Classic pasta dishes and risotto',
    color: '#CE2B37',
    tags: ['Italian', 'Fine Dining'],
  },
  {
    id: '7',
    emoji: '🥘',
    name: 'Spanish Tapas',
    description: 'Small plates and Mediterranean flavors',
    color: '#FFC400',
    tags: ['Spanish', 'Social'],
  },
  {
    id: '8',
    emoji: '🍱',
    name: 'Korean BBQ',
    description: 'Grill your own meat at the table',
    color: '#E31838',
    tags: ['Korean', 'Interactive'],
  },
  {
    id: '9',
    emoji: '🥗',
    name: 'Fresh & Fit',
    description: 'Health-conscious salads and bowls',
    color: '#6B8E23',
    tags: ['Healthy', 'Quick'],
  },
  {
    id: '10',
    emoji: '🍲',
    name: 'Thai Cuisine',
    description: 'Fragrant curries and noodle dishes',
    color: '#DC143C',
    tags: ['Thai', 'Spicy'],
  },
];
