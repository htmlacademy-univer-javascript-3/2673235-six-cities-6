import { createReducer } from '@reduxjs/toolkit';
import { changeCity, loadOffers, setOffersLoading, setError } from '../action';
import type { City, Offer } from '../types';

export type AppState = {
  city: City;
  offers: Offer[];
  isOffersLoading: boolean;
  error: string | null;
};

const initialState: AppState = {
  city: 'Paris',
  offers: [],
  isOffersLoading: false,
  error: null,
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
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    });
});
