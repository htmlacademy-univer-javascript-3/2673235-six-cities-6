import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import App from './app/app';
import { store } from './store';
import { fetchOffers, checkAuthStatus, setAuthorizationStatus } from './store/action';
import { AuthorizationStatus } from './store/const';
import { getToken } from './services/token';

store.dispatch(fetchOffers());

if (getToken()) {
  store.dispatch(checkAuthStatus());
} else {
  store.dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
