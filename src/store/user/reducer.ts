import { createReducer } from '@reduxjs/toolkit';
import { setAuthorizationStatus, setUser } from '../action';
import { AuthorizationStatus } from '../const';
import type { User } from '../types';

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
};

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
});
