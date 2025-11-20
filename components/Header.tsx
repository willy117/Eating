import React from 'react';
import { MapPin } from 'lucide-react';
import { GeoLocation } from '../types';

interface HeaderProps {
  location: GeoLocation | null;
  onRetryLocation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ location, onRetryLocation }) => {
  return (
    <header className="w-full bg-brand-500 text-white py-6 px-4 shadow-md sticky top-0 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">現在吃什麼</h1>
          <p className="text-brand-100 text-sm">智能美食推薦</p>
        </div>
        <button 
          onClick={onRetryLocation}
          className="flex items-center gap-1 bg-brand-600 hover:bg-brand-700 px-3 py-2 rounded-full text-xs font-medium transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {location ? "已定位" : "定位中..."}
        </button>
      </div>
    </header>
  );
};