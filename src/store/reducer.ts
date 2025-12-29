import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from './app/reducer';
import { userReducer } from './user/reducer';
import { offerReducer } from './offer/reducer';
import { favoritesReducer } from './favorites/reducer';

export const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  offer: offerReducer,
  favorites: favoritesReducer,
});
