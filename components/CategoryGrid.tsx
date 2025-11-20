import React from 'react';
import { CATEGORIES, getCategoryIcon } from '../constants';
import { CategoryOption } from '../types';

interface CategoryGridProps {
  selectedCategory: string | null;
  onSelect: (id: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {CATEGORIES.map((cat: CategoryOption) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200
              ${isSelected 
                ? 'bg-brand-500 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-600 shadow-sm hover:bg-brand-50 hover:text-brand-600'}
            `}
          >
            <div className="mb-1">
              {getCategoryIcon(cat.iconName, isSelected ? "w-6 h-6" : "w-6 h-6 opacity-80")}
            </div>
            <span className="text-xs font-medium">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};