import React from 'react';
import { Star, Navigation } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  data: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-5 flex flex-col h-full transition-all hover:shadow-md hover:border-brand-200 transform hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{data.name}</h3>
        <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg shrink-0 ml-3">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
          <span className="text-sm font-bold">{data.rating}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
          {data.cuisine}
        </span>
        <span className="text-xs text-gray-500 font-medium border border-gray-200 px-2 py-0.5 rounded-md">
          {data.priceLevel}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed">
        {data.description}
      </p>
      
      <a 
        href={data.mapUri} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-auto w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-medium transition-colors shadow-sm"
      >
        <Navigation className="w-4 h-4" />
        前往導航
      </a>
    </div>
  );
};