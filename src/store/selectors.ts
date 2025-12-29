import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { City, Offer, OfferDetails, User } from './types';
import type { Review } from '../types/review';
import { AuthorizationStatus } from './const';

export const selectCity = (state: RootState): City => state.app.city;
export const selectOffers = (state: RootState): Offer[] => state.app.offers;
export const selectIsOffersLoading = (state: RootState): boolean => state.app.isOffersLoading;
export const selectError = (state: RootState): string | null => state.app.error;

export const selectAuthorizationStatus = (state: RootState): AuthorizationStatus => state.user.authorizationStatus;
export const selectUser = (state: RootState): User | null => state.user.user;

export const selectOffer = (state: RootState): OfferDetails | null => state.offer.offer;
export const selectNearOffers = (state: RootState): Offer[] => state.offer.nearOffers;
export const selectReviews = (state: RootState): Review[] => state.offer.reviews;
export const selectIsOfferLoading = (state: RootState): boolean => state.offer.isOfferLoading;
export const selectIsOfferNotFound = (state: RootState): boolean => state.offer.isOfferNotFound;
export const selectIsCommentSending = (state: RootState): boolean => state.offer.isCommentSending;

export const selectFavorites = (state: RootState): Offer[] => state.favorites.favorites;
export const selectIsFavoritesLoading = (state: RootState): boolean => state.favorites.isFavoritesLoading;

export const selectFavoritesCount = createSelector(
  [selectFavorites],
  (favorites) => favorites.length,
);

export const selectOffersForCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city === city),
);

export const selectNearOffersLimited = createSelector(
  [selectNearOffers],
  (offers) => offers.slice(0, 3),
);

export const selectSortedReviewsLimited = createSelector(
  [selectReviews],
  (reviews) =>
    [...reviews]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10),
);
