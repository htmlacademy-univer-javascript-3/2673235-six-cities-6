import { createAction } from '@reduxjs/toolkit';
import type { ThunkAction } from 'redux-thunk';
import type { AxiosInstance } from 'axios';
import type { Action } from 'redux';
import type { City, Offer, OfferDetails, User } from './types';
import type { Review } from '../types/review';
import type { RootState } from './index';
import { AuthorizationStatus } from './const';
import { saveToken, dropToken } from '../services/token';

type ThunkResult<R> = ThunkAction<R, RootState, AxiosInstance, Action>;

export const changeCity = createAction<City>('app/changeCity');
export const loadOffers = createAction<Offer[]>('app/loadOffers');
export const setOffersLoading = createAction<boolean>('app/setOffersLoading');
export const setError = createAction<string | null>('app/setError');

export const setAuthorizationStatus = createAction<AuthorizationStatus>('user/setAuthorizationStatus');
export const setUser = createAction<User | null>('user/setUser');

export const loadOffer = createAction<OfferDetails | null>('offer/loadOffer');
export const loadNearOffers = createAction<Offer[]>('offer/loadNearOffers');
export const loadReviews = createAction<Review[]>('offer/loadReviews');
export const setOfferLoading = createAction<boolean>('offer/setOfferLoading');
export const setOfferNotFound = createAction<boolean>('offer/setOfferNotFound');
export const setCommentSending = createAction<boolean>('offer/setCommentSending');

export const loadFavorites = createAction<Offer[]>('favorites/loadFavorites');
export const setFavoritesLoading = createAction<boolean>('favorites/setFavoritesLoading');
export const clearFavorites = createAction('favorites/clearFavorites');

type ServerCity = {
  name: City;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
};

type ServerOffer = {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  isPremium: boolean;
  isFavorite: boolean;
  previewImage: string;
  city: ServerCity;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
};

type ServerOfferDetails = ServerOffer & {
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

type ServerUser = {
  name: string;
  avatarUrl: string;
  email: string;
  isPro: boolean;
  token: string;
};

type ServerReview = {
  id: string;
  date: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    avatarUrl?: string | null;
    isPro: boolean;
  };
};

type OfferType = Offer['type'];

function adaptOfferType(value: string): OfferType {
  switch (value) {
    case 'apartment':
    case 'room':
    case 'house':
    case 'hotel':
      return value;
    default:
      return 'apartment';
  }
}

function adaptOfferToClient(offer: ServerOffer): Offer {
  return {
    id: offer.id,
    title: offer.title,
    type: adaptOfferType(offer.type),
    price: offer.price,
    rating: offer.rating,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    previewImage: offer.previewImage,
    city: offer.city.name,
    location: {
      lat: offer.location.latitude,
      lng: offer.location.longitude,
      zoom: offer.location.zoom,
    },
  };
}

function adaptOfferDetailsToClient(offer: ServerOfferDetails): OfferDetails {
  const base = adaptOfferToClient(offer);

  return {
    ...base,
    description: offer.description,
    bedrooms: offer.bedrooms,
    maxAdults: offer.maxAdults,
    goods: offer.goods,
    images: offer.images,
    host: offer.host,
  };
}

function adaptUserToClient(user: ServerUser): User {
  return {
    name: user.name,
    avatarUrl: user.avatarUrl,
    email: user.email,
    isPro: user.isPro,
    token: user.token,
  };
}

function adaptReviewToClient(review: ServerReview): Review {
  return {
    id: review.id,
    userName: review.user.name,
    avatarUrl: review.user.avatarUrl ?? undefined,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
  };
}

function sortReviewsByDate(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

function mergeReviews(existing: Review[], incoming: Review[]): Review[] {
  const map = new Map<string, Review>();

  for (const review of incoming) {
    map.set(review.id, review);
  }

  for (const review of existing) {
    if (!map.has(review.id)) {
      map.set(review.id, review);
    }
  }

  return sortReviewsByDate(Array.from(map.values())).slice(0, 10);
}

const ERROR_TEXT = 'Server is unavailable. Try again later.';

export const fetchOffers = (): ThunkResult<Promise<void>> => async (dispatch, _getState, api) => {
  dispatch(setOffersLoading(true));
  dispatch(setError(null));

  try {
    const { data } = await api.get<ServerOffer[]>('/offers');
    dispatch(loadOffers(data.map(adaptOfferToClient)));
  } catch {
    dispatch(setError(ERROR_TEXT));
  } finally {
    dispatch(setOffersLoading(false));
  }
};

export const fetchFavorites = (): ThunkResult<Promise<void>> => async (dispatch, _getState, api) => {
  dispatch(setFavoritesLoading(true));
  dispatch(setError(null));

  try {
    const { data } = await api.get<ServerOffer[]>('/favorite');
    dispatch(loadFavorites(data.map(adaptOfferToClient)));
  } catch {
    dispatch(setError(ERROR_TEXT));
  } finally {
    dispatch(setFavoritesLoading(false));
  }
};

export const fetchOfferById = (offerId: string): ThunkResult<Promise<void>> => async (dispatch, _getState, api) => {
  dispatch(setOfferNotFound(false));
  dispatch(setOfferLoading(true));
  dispatch(setError(null));

  dispatch(loadOffer(null));
  dispatch(loadNearOffers([]));
  dispatch(loadReviews([]));

  try {
    const [offerRes, nearbyRes, reviewsRes] = await Promise.all([
      api.get<ServerOfferDetails>(`/offers/${offerId}`),
      api.get<ServerOffer[]>(`/offers/${offerId}/nearby`),
      api.get<ServerReview[]>(`/comments/${offerId}`),
    ]);

    dispatch(loadOffer(adaptOfferDetailsToClient(offerRes.data)));
    dispatch(loadNearOffers(nearbyRes.data.map(adaptOfferToClient)));
    dispatch(loadReviews(sortReviewsByDate(reviewsRes.data.map(adaptReviewToClient)).slice(0, 10)));
  } catch (err) {
    const status = (err as { response?: { status?: number } }).response?.status;

    if (status === 404) {
      dispatch(setOfferNotFound(true));
    } else {
      dispatch(setError(ERROR_TEXT));
    }
  } finally {
    dispatch(setOfferLoading(false));
  }
};

export const checkAuthStatus = (): ThunkResult<Promise<void>> => async (dispatch, _getState, api) => {
  try {
    const { data } = await api.get<ServerUser>('/login');
    const user = adaptUserToClient(data);

    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    dispatch(setUser(user));
    dispatch(fetchFavorites());
  } catch {
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    dispatch(setUser(null));
  }
};

type LoginData = { email: string; password: string };

export function loginAction(loginData: LoginData): ThunkResult<Promise<void>>;
export function loginAction(email: string, password: string): ThunkResult<Promise<void>>;
export function loginAction(arg1: LoginData | string, arg2?: string): ThunkResult<Promise<void>> {
  return async (dispatch, _getState, api) => {
    dispatch(setError(null));

    const email = typeof arg1 === 'string' ? arg1 : arg1.email;
    const password = typeof arg1 === 'string' ? (arg2 as string) : arg1.password;

    try {
      const { data } = await api.post<ServerUser>('/login', { email, password });
      const user = adaptUserToClient(data);

      saveToken(user.token);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      dispatch(setUser(user));
      dispatch(fetchFavorites());
    } catch (err) {
      dispatch(setError('Failed to login. Try again'));
      throw err;
    }
  };
}

export const logoutAction = (): ThunkResult<void> => (dispatch) => {
  dropToken();
  dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
  dispatch(setUser(null));
  dispatch(clearFavorites());
};

type ToggleFavoriteData = { offerId: string; status: 0 | 1 };

export function toggleFavorite(offerId: string, status: 0 | 1): ThunkResult<Promise<void>>;
export function toggleFavorite(data: ToggleFavoriteData): ThunkResult<Promise<void>>;
export function toggleFavorite(arg1: string | ToggleFavoriteData, arg2?: 0 | 1): ThunkResult<Promise<void>> {
  return async (dispatch, getState, api) => {
    const offerId = typeof arg1 === 'string' ? arg1 : arg1.offerId;
    const status = typeof arg1 === 'string' ? (arg2 as 0 | 1) : arg1.status;

    dispatch(setError(null));

    try {
      const { data } = await api.post<ServerOffer>(`/favorite/${offerId}/${status}`);
      const updated = adaptOfferToClient(data);

      const offers = getState().app.offers;
      if (offers.length) {
        dispatch(loadOffers(offers.map((o) => (o.id === updated.id ? { ...o, isFavorite: updated.isFavorite } : o))));
      }

      const offerDetails = getState().offer.offer;
      if (offerDetails && offerDetails.id === updated.id) {
        dispatch(loadOffer({ ...offerDetails, isFavorite: updated.isFavorite }));
      }

      const nearOffers = getState().offer.nearOffers;
      if (nearOffers.length) {
        dispatch(loadNearOffers(nearOffers.map((o) => (o.id === updated.id ? { ...o, isFavorite: updated.isFavorite } : o))));
      }

      const favorites = getState().favorites.favorites;
      if (updated.isFavorite) {
        const exists = favorites.some((o) => o.id === updated.id);
        const nextFavorites = exists
          ? favorites.map((o) => (o.id === updated.id ? { ...o, isFavorite: true } : o))
          : [{ ...updated, isFavorite: true }, ...favorites];
        dispatch(loadFavorites(nextFavorites));
      } else {
        dispatch(loadFavorites(favorites.filter((o) => o.id !== updated.id)));
      }
    } catch {
      dispatch(setError(ERROR_TEXT));
    }
  };
}

type CommentData = { comment: string; rating: number };

export function postComment(offerId: string, comment: string, rating: number): ThunkResult<Promise<void>>;
export function postComment(offerId: string, data: CommentData): ThunkResult<Promise<void>>;
export function postComment(
  offerId: string,
  arg2: string | CommentData,
  arg3?: number,
): ThunkResult<Promise<void>> {
  return async (dispatch, getState, api) => {
    dispatch(setCommentSending(true));
    dispatch(setError(null));

    const payload: CommentData =
      typeof arg2 === 'string'
        ? { comment: arg2, rating: arg3 as number }
        : { comment: arg2.comment, rating: arg2.rating };

    try {
      const { data } = await api.post<ServerReview[] | ServerReview>(`/comments/${offerId}`, payload);

      const incoming = Array.isArray(data)
        ? data.map(adaptReviewToClient)
        : [adaptReviewToClient(data)];

      const existing = getState().offer.reviews;
      const nextReviews = mergeReviews(existing, incoming);

      dispatch(loadReviews(nextReviews));
    } catch (err) {
      dispatch(setError('Failed to send comment. Try again'));
      throw err;
    } finally {
      dispatch(setCommentSending(false));
    }
  };
}
