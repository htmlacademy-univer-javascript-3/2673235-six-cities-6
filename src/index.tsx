import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);

const offersCount = 312;
const isAuthorized = false;

root.render(
  <StrictMode>
    <BrowserRouter>
      <App offersCount={offersCount} isAuthorized={isAuthorized} />
    </BrowserRouter>
  </StrictMode>
);
