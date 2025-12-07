import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import 'leaflet/dist/leaflet.css';
import { store } from './store';
import { fetchOffers, checkAuthStatus } from './store/action';

store.dispatch(fetchOffers());
store.dispatch(checkAuthStatus());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
