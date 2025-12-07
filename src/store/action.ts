import { createAction } from '@reduxjs/toolkit';
import type { ThunkAction } from 'redux-thunk';
import type { AxiosInstance } from 'axios';
import type { Action } from 'redux';
import type { City, Offer } from './reducer';
import type { RootState } from './index';

export const changeCity = createAction<City>('app/changeCity');
export const loadOffers = createAction<Offer[]>('app/loadOffers');
export const setOffersLoading = createAction<boolean>('app/setOffersLoading');

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
  isFavorite: boolean;
  isPremium: boolean;
  previewImage: string;
  city: ServerCity;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
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
    },
  };
}

export const fetchOffers = (): ThunkResult<Promise<void>> => async (
  dispatch,
  _getState,
  api
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
