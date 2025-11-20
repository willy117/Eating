import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { Filters } from './components/Filters';
import { RestaurantCard } from './components/RestaurantCard';
import { AppState, PriceLevel, DistanceRange } from './types';
import { fetchRecommendations } from './services/geminiService';
import { Loader2, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    location: null,
    locationError: null,
    selectedCategory: null,
    selectedPrice: PriceLevel.MODERATE,
    selectedDistance: DistanceRange.WALKABLE,
    isLoading: false,
    recommendations: [],
    error: null
  });

  // Get Location on Mount
  const getLocation = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, locationError: null }));
    
    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        locationError: "您的瀏覽器不支援地理定位" 
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
      },
      (error) => {
        let errorMsg = "無法取得位置";
        switch(error.code) {
          case error.PERMISSION_DENIED: errorMsg = "請允許存取位置以尋找附近餐廳"; break;
          case error.POSITION_UNAVAILABLE: errorMsg = "位置資訊無法使用"; break;
          case error.TIMEOUT: errorMsg = "定位逾時，請重試"; break;
        }
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          locationError: errorMsg 
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Handle Recommendation Search
  // Function is kept for potential manual retry or other uses
  const handleSearch = async () => {
    if (!state.location || !state.selectedCategory) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, recommendations: [] }));

    try {
      const results = await fetchRecommendations(
        state.location,
        state.selectedCategory,
        state.selectedPrice,
        state.selectedDistance
      );
      setState(prev => ({ ...prev, isLoading: false, recommendations: results }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "AI 暫時無法回應，請稍後再試或檢查網路連線。" 
      }));
    }
  };

  // Trigger search when category is selected (or if filters change while category is selected)
  const handleCategorySelect = (id: string) => {
    setState(prev => ({ ...prev, selectedCategory: id }));
    
    if (state.location) {
      setState(prev => ({ ...prev, selectedCategory: id, isLoading: true, error: null, recommendations: [] }));
      fetchRecommendations(state.location, id, state.selectedPrice, state.selectedDistance)
        .then(results => {
          setState(prev => ({ ...prev, isLoading: false, recommendations: results }));
        })
        .catch(() => {
           setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: "AI 搜尋失敗，請稍後再試。" 
          }));
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Header location={state.location} onRetryLocation={getLocation} />

      <main className="flex-1 w-full max-w-md mx-auto p-4 pb-20">
        {/* Location Error State */}
        {state.locationError && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 text-sm font-medium">{state.locationError}</div>
            <button onClick={getLocation} className="text-xs bg-red-200 hover:bg-red-300 px-3 py-1 rounded-lg">
              重試
            </button>
          </div>
        )}

        {/* Welcome Text */}
        {!state.locationError && !state.selectedCategory && !state.isLoading && (
          <div className="mb-6 text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">今天想吃點什麼？</h2>
            <p className="text-gray-500">選擇一個類別，馬上為您推薦</p>
          </div>
        )}

        {/* Controls */}
        <div className={state.recommendations.length > 0 ? "hidden md:block" : "block"}>
            <Filters 
            selectedPrice={state.selectedPrice}
            selectedDistance={state.selectedDistance}
            onPriceChange={(p) => setState(prev => ({ ...prev, selectedPrice: p }))}
            onDistanceChange={(d) => setState(prev => ({ ...prev, selectedDistance: d }))}
            />
            
            <CategoryGrid 
            selectedCategory={state.selectedCategory}
            onSelect={handleCategorySelect}
            />
        </div>
        
        {/* Loading State */}
        {state.isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-brand-600">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-medium animate-pulse">正在搜尋附近美味...</p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm p-6">
            <p className="mb-2">😕 {state.error}</p>
            <button 
              onClick={() => state.selectedCategory && handleCategorySelect(state.selectedCategory)}
              className="text-brand-600 font-bold hover:underline"
            >
              再試一次
            </button>
          </div>
        )}

        {/* Results List */}
        {!state.isLoading && state.recommendations.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-gray-800">推薦結果</h3>
                <button 
                    onClick={() => setState(prev => ({ ...prev, selectedCategory: null, recommendations: [] }))}
                    className="text-sm text-brand-600 font-medium hover:underline"
                >
                    重新選擇
                </button>
            </div>
            {state.recommendations.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                data={restaurant} 
              />
            ))}
            
             <div className="text-center pt-8 pb-4 text-gray-400 text-xs">
                Powered by Google Gemini & Google Maps
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;