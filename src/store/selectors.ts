import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { City, Offer, User } from './reducer';
import { AuthorizationStatus } from './const';

export const selectCity = (state: RootState): City => state.city;

export const selectOffers = (state: RootState): Offer[] => state.offers;

export const selectIsOffersLoading = (state: RootState): boolean =>
  state.isOffersLoading;

export const selectAuthorizationStatus = (
  state: RootState,
): AuthorizationStatus => state.authorizationStatus;

export const selectUser = (state: RootState): User | null => state.user;

export const selectOffersByCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city === city),
);

export const selectFavoriteOffers = createSelector(
  [selectOffers],
  (offers) => offers.filter((offer) => offer.isFavorite),
);
