import { createReducer } from '@reduxjs/toolkit';
import { changeCity, loadOffers } from './action';
import type { Offer } from '../mocks/offers';

export type City =
  | 'Paris'
  | 'Cologne'
  | 'Brussels'
  | 'Amsterdam'
  | 'Hamburg'
  | 'Dusseldorf';

type State = {
  city: City;
  offers: Offer[];
};

const initialState: State = {
  city: 'Paris',
  offers: [],
};

export const appReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload as State['city'];
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    });
});
