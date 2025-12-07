import { createReducer } from '@reduxjs/toolkit';
import { changeCity, loadOffers, setOffersLoading } from './action';

export type City = 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';

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
  location: { lat: number; lng: number };
};

type State = {
  city: City;
  offers: Offer[];
  isOffersLoading: boolean;
};

const initialState: State = {
  city: 'Paris',
  offers: [],
  isOffersLoading: false,
};

export const appReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setOffersLoading, (state, action) => {
      state.isOffersLoading = action.payload;
    });
});
