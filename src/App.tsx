import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import FavoritesPage from './pages/FavoritesPage';
import OfferPage from './pages/OfferPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import type { Offer } from './mocks/offers';

type AppProps = {
  offers: Offer[];
  isAuthorized: boolean;
};

export default function App({ offers, isAuthorized }: AppProps) {
  const favoriteOffers = offers.filter((o) => o.isFavorite);
  return (
    <Routes>
      <Route path="/" element={<MainPage offers={offers} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute isAuthorized={isAuthorized}>
            <FavoritesPage offers={favoriteOffers} />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<OfferPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
