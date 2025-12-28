import { createReducer } from '@reduxjs/toolkit';
import {
  changeCity,
  loadOffers,
  setOffersLoading,
  setAuthorizationStatus,
  setUser,
  loadOffer,
  loadNearOffers,
  loadReviews,
  setOfferLoading,
  setOfferNotFound,
  setCommentSending,
} from './action';
import { AuthorizationStatus } from './const';
import type { Review } from '../types/review';

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

export type State = {
  city: City;
  offers: Offer[];
  isOffersLoading: boolean;
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  offer: OfferDetails | null;
  nearOffers: Offer[];
  reviews: Review[];
  isOfferLoading: boolean;
  isOfferNotFound: boolean;
  isCommentSending: boolean;
};

const initialState: State = {
  city: 'Paris',
  offers: [],
  isOffersLoading: false,
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  offer: null,
  nearOffers: [],
  reviews: [],
  isOfferLoading: false,
  isOfferNotFound: false,
  isCommentSending: false,
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
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(loadOffer, (state, action) => {
      state.offer = action.payload;
    })
    .addCase(loadNearOffers, (state, action) => {
      state.nearOffers = action.payload;
    })
    .addCase(loadReviews, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(setOfferLoading, (state, action) => {
      state.isOfferLoading = action.payload;
    })
    .addCase(setOfferNotFound, (state, action) => {
      state.isOfferNotFound = action.payload;
    })
    .addCase(setCommentSending, (state, action) => {
      state.isCommentSending = action.payload;
    });
});
