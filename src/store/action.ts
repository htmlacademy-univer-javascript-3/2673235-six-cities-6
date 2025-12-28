import { createAction } from '@reduxjs/toolkit';
import type { ThunkAction } from 'redux-thunk';
import type { AxiosInstance } from 'axios';
import type { Action } from 'redux';
import type { City, Offer, OfferDetails, User } from './reducer';
import type { Review } from '../types/review';
import type { RootState } from './index';
import { AuthorizationStatus } from './const';
import { saveToken, dropToken } from '../services/token';

export const changeCity = createAction<City>('app/changeCity');
export const loadOffers = createAction<Offer[]>('app/loadOffers');
export const setOffersLoading = createAction<boolean>('app/setOffersLoading');

export const loadOffer = createAction<OfferDetails | null>('offer/loadOffer');
export const loadNearOffers = createAction<Offer[]>('offer/loadNearOffers');
export const loadReviews = createAction<Review[]>('offer/loadReviews');
export const setOfferLoading = createAction<boolean>('offer/setOfferLoading');
export const setOfferNotFound = createAction<boolean>('offer/setOfferNotFound');
export const setCommentSending = createAction<boolean>('offer/setCommentSending');

export const setAuthorizationStatus = createAction<AuthorizationStatus>(
  'user/setAuthorizationStatus',
);

export const setUser = createAction<User | null>('user/setUser');

type ThunkResult<R = void> = ThunkAction<R, RootState, AxiosInstance, Action>;

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
  type: 'apartment' | 'room' | 'house' | 'hotel';
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

type ServerReview = {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl: string | null;
  };
  comment: string;
  rating: number;
};

type ServerUser = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
  email: string;
  token: string;
};

function adaptOfferToClient(offer: ServerOffer): Offer {
  return {
    id: offer.id,
    title: offer.title,
    type: offer.type,
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
  return {
    ...adaptOfferToClient(offer),
    description: offer.description,
    bedrooms: offer.bedrooms,
    maxAdults: offer.maxAdults,
    goods: offer.goods,
    images: offer.images,
    host: {
      name: offer.host.name,
      avatarUrl: offer.host.avatarUrl,
      isPro: offer.host.isPro,
    },
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

function adaptUserToClient(user: ServerUser): User {
  return {
    name: user.name,
    avatarUrl: user.avatarUrl,
    email: user.email,
    isPro: user.isPro,
    token: user.token,
  };
}

export const fetchOffers = (): ThunkResult<Promise<void>> => async (
  dispatch,
  _getState,
  api,
) => {
  dispatch(setOffersLoading(true));

  try {
    const { data } = await api.get<ServerOffer[]>('/offers');
    dispatch(loadOffers(data.map(adaptOfferToClient)));
  } finally {
    dispatch(setOffersLoading(false));
  }
};

export const fetchOfferById = (
  offerId: string,
): ThunkResult<Promise<void>> => async (dispatch, getState, api) => {
  dispatch(setOfferNotFound(false));
  dispatch(setOfferLoading(true));

  dispatch(loadOffer(null));
  dispatch(loadNearOffers([]));
  dispatch(loadReviews([]));

  const loadAll = async (id: string) => {
    const [offerRes, nearbyRes, reviewsRes] = await Promise.all([
      api.get<ServerOfferDetails>(`/offers/${id}`),
      api.get<ServerOffer[]>(`/offers/${id}/nearby`),
      api.get<ServerReview[]>(`/comments/${id}`),
    ]);

    dispatch(loadOffer(adaptOfferDetailsToClient(offerRes.data)));
    dispatch(loadNearOffers(nearbyRes.data.map(adaptOfferToClient)));
    dispatch(loadReviews(reviewsRes.data.map(adaptReviewToClient)));
  };

  try {
    await loadAll(offerId);
  } catch (err) {
    const status = (err as { response?: { status?: number } }).response?.status;

    if (status === 404) {
      let fixedId = getState().offers.find((o) => o.id.startsWith(offerId))?.id;

      if (!fixedId) {
        try {
          const { data } = await api.get<ServerOffer[]>('/offers');
          fixedId = data.find((o) => o.id.startsWith(offerId))?.id;
        } catch {
          fixedId = undefined;
        }
      }

      if (fixedId) {
        try {
          await loadAll(fixedId);
          return;
        } catch {
          dispatch(setOfferNotFound(true));
        }
      } else {
        dispatch(setOfferNotFound(true));
      }
    }
  } finally {
    dispatch(setOfferLoading(false));
  }
};

type PostCommentData = {
  offerId: string;
  comment: string;
  rating: number;
};

export const postComment = (
  data: PostCommentData,
): ThunkResult<Promise<void>> => async (dispatch, getState, api) => {
  dispatch(setCommentSending(true));
  try {
    const { data: result } = await api.post<ServerReview | ServerReview[]>(
      `/comments/${data.offerId}`,
      { comment: data.comment, rating: data.rating },
    );

    if (Array.isArray(result)) {
      dispatch(loadReviews(result.map(adaptReviewToClient)));
    } else {
      const current = getState().reviews;
      dispatch(loadReviews([adaptReviewToClient(result), ...current]));
    }
  } finally {
    dispatch(setCommentSending(false));
  }
};

export const checkAuthStatus = (): ThunkResult<Promise<void>> => async (
  dispatch,
  _getState,
  api,
) => {
  try {
    const { data } = await api.get<ServerUser>('/login');
    const user = adaptUserToClient(data);
    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    dispatch(setUser(user));
  } catch {
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    dispatch(setUser(null));
  }
};

type LoginData = {
  email: string;
  password: string;
};

export const loginAction = (
  loginData: LoginData,
): ThunkResult<Promise<void>> => async (dispatch, _getState, api) => {
  const { data } = await api.post<ServerUser>('/login', loginData);
  saveToken(data.token);

  const user = adaptUserToClient(data);
  dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
  dispatch(setUser(user));
};

export const logoutAction = (): ThunkResult<Promise<void>> => async (
  dispatch,
  _getState,
  api,
) => {
  await api.delete('/logout');
  dropToken();
  dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
  dispatch(setUser(null));
};
