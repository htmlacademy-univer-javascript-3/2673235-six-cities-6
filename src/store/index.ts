import { configureStore } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import { rootReducer } from './reducer';
import { createAPI } from '../api';

const api: AxiosInstance = createAPI();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
