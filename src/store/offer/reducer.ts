import { createReducer } from '@reduxjs/toolkit';
import {
  loadOffer,
  loadNearOffers,
  loadReviews,
  setOfferLoading,
  setOfferNotFound,
  setCommentSending,
} from '../action';
import type { Offer, OfferDetails } from '../types';
import type { Review } from '../../types/review';

export type OfferState = {
  offer: OfferDetails | null;
  nearOffers: Offer[];
  reviews: Review[];
  isOfferLoading: boolean;
  isOfferNotFound: boolean;
  isCommentSending: boolean;
};

const initialState: OfferState = {
  offer: null,
  nearOffers: [],
  reviews: [],
  isOfferLoading: false,
  isOfferNotFound: false,
  isCommentSending: false,
};

export const offerReducer = createReducer(initialState, (builder) => {
  builder
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
