import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'leaflet/dist/leaflet.css';

import { Provider } from 'react-redux';
import { store } from './store';
import { loadOffers } from './store/action';
import { offers } from './mocks/offers';

const IS_AUTHORIZED = false;

store.dispatch(loadOffers(offers));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App offers={offers} isAuthorized={IS_AUTHORIZED} />
    </Provider>
  </React.StrictMode>,
);
