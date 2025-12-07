import { createAction } from '@reduxjs/toolkit';
import type { ThunkAction } from 'redux-thunk';
import type { AxiosInstance } from 'axios';
import type { Action } from 'redux';
import type { City, Offer, User } from './reducer';
import type { RootState } from './index';
import { AuthorizationStatus } from './const';
import { saveToken, dropToken } from '../services/token';

export const changeCity = createAction<City>('app/changeCity');
export const loadOffers = createAction<Offer[]>('app/loadOffers');
export const setOffersLoading = createAction<boolean>('app/setOffersLoading');

export const setAuthorizationStatus =
  createAction<AuthorizationStatus>('user/setAuthorizationStatus');

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
    const adapted = data.map(adaptOfferToClient);
    dispatch(loadOffers(adapted));
  } finally {
    dispatch(setOffersLoading(false));
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
): ThunkResult<Promise<void>> => async (
  dispatch,
  _getState,
  api,
) => {
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
