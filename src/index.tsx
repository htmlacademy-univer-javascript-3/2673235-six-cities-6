import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'leaflet/dist/leaflet.css';

import { Provider } from 'react-redux';
import { store } from './store';
import { fetchOffers } from './store/action';

const IS_AUTHORIZED = false;

store.dispatch(fetchOffers());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App isAuthorized={IS_AUTHORIZED} />
    </Provider>
  </React.StrictMode>,
);
