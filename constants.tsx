import { CategoryOption, DistanceRange, PriceLevel } from './types';
import { Utensils, Coffee, Pizza, Beef, Soup, Fish, Drumstick, Beer, Sandwich, Globe } from 'lucide-react';

export const CATEGORIES: CategoryOption[] = [
  { id: 'local', label: '台式小吃', iconName: 'Soup' },
  { id: 'japanese', label: '日式料理', iconName: 'Fish' },
  { id: 'western', label: '西式/美式', iconName: 'Pizza' },
  { id: 'steak', label: '火鍋/燒肉', iconName: 'Beef' },
  { id: 'chinese', label: '中式合菜', iconName: 'Utensils' },
  { id: 'fastfood', label: '速食炸物', iconName: 'Drumstick' },
  { id: 'cafe', label: '咖啡甜點', iconName: 'Coffee' },
  { id: 'brunch', label: '早午餐', iconName: 'Sandwich' },
  { id: 'bar', label: '居酒屋/餐酒', iconName: 'Beer' },
  { id: 'anything', label: '隨便都可以', iconName: 'Globe' },
];

// Helper to render icon by name
export const getCategoryIcon = (name: string, className?: string) => {
  const props = { className: className || "w-6 h-6" };
  switch (name) {
    case 'Soup': return <Soup {...props} />;
    case 'Fish': return <Fish {...props} />;
    case 'Pizza': return <Pizza {...props} />;
    case 'Beef': return <Beef {...props} />;
    case 'Utensils': return <Utensils {...props} />;
    case 'Drumstick': return <Drumstick {...props} />;
    case 'Coffee': return <Coffee {...props} />;
    case 'Sandwich': return <Sandwich {...props} />;
    case 'Beer': return <Beer {...props} />;
    case 'Globe': return <Globe {...props} />;
    default: return <Utensils {...props} />;
  }
};

export const PRICE_OPTIONS = Object.values(PriceLevel);
export const DISTANCE_OPTIONS = Object.values(DistanceRange);