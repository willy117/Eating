import React from 'react';
import { DistanceRange, PriceLevel } from '../types';
import { PRICE_OPTIONS, DISTANCE_OPTIONS } from '../constants';

interface FiltersProps {
  selectedPrice: PriceLevel;
  selectedDistance: DistanceRange;
  onPriceChange: (p: PriceLevel) => void;
  onDistanceChange: (d: DistanceRange) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedPrice,
  selectedDistance,
  onPriceChange,
  onDistanceChange
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 space-y-4">
      {/* Price Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">預算範圍</label>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {PRICE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onPriceChange(option)}
              className={`
                px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors
                ${selectedPrice === option
                  ? 'bg-brand-100 border-brand-500 text-brand-700 font-bold'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}
              `}
            >
              {option.split(' ')[0]} <span className="text-xs opacity-70">{option.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Distance Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">最大距離</label>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {DISTANCE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onDistanceChange(option)}
              className={`
                px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors
                ${selectedDistance === option
                  ? 'bg-brand-100 border-brand-500 text-brand-700 font-bold'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};