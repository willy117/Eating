export enum PriceLevel {
  CHEAP = '$ (平價)',
  MODERATE = '$$ (適中)',
  EXPENSIVE = '$$$ (高級)',
  LUXURY = '$$$$ (奢華)'
}

export enum DistanceRange {
  NEAR = '500m 內',
  WALKABLE = '1km 內',
  DRIVING = '3km 內',
  FAR = '不限距離'
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: string;
  rating: string;
  description: string;
  address?: string;
  mapUri?: string; // From Google Maps grounding
}

export interface AppState {
  location: GeoLocation | null;
  locationError: string | null;
  selectedCategory: string | null;
  selectedPrice: PriceLevel;
  selectedDistance: DistanceRange;
  isLoading: boolean;
  recommendations: Restaurant[];
  error: string | null;
}

export interface CategoryOption {
  id: string;
  label: string;
  iconName: string; // We will map this to Lucide icons dynamically
}