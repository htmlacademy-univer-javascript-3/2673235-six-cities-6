export type City =
  | 'Paris'
  | 'Cologne'
  | 'Brussels'
  | 'Amsterdam'
  | 'Hamburg'
  | 'Dusseldorf';

export type Offer = {
  id: string;
  title: string;
  type: 'apartment' | 'room' | 'house' | 'hotel';
  price: number;
  rating: number;
  isPremium: boolean;
  isFavorite: boolean;
  previewImage: string;
  city: City;
  location: {
    lat: number;
    lng: number;
    zoom: number;
  };
};

export type OfferDetails = Offer & {
  description: string;
  bedrooms: number;
  maxAdults: number;
  goods: string[];
  images: string[];
  host: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
};

export type User = {
  name: string;
  avatarUrl: string;
  email: string;
  isPro: boolean;
  token: string;
};
