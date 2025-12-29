import { createReducer } from '@reduxjs/toolkit';
import type { Offer } from '../types';
import { loadFavorites, setFavoritesLoading, clearFavorites } from '../action';

export type FavoritesState = {
  favorites: Offer[];
  isFavoritesLoading: boolean;
};

const initialState: FavoritesState = {
  favorites: [],
  isFavoritesLoading: false,
};

export const favoritesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadFavorites, (state, action) => {
      state.favorites = action.payload;
    })
    .addCase(setFavoritesLoading, (state, action) => {
      state.isFavoritesLoading = action.payload;
    })
    .addCase(clearFavorites, (state) => {
      state.favorites = [];
    });
});
