import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainPage from './pages/MainPage';
import FavoritesPage from './pages/FavoritesPage';
import OfferPage from './pages/OfferPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import type { RootState } from './store';

type AppProps = {
  isAuthorized: boolean;
};

export default function App({ isAuthorized }: AppProps) {
  const offers = useSelector((state: RootState) => state.offers);
  const favoriteOffers = offers.filter((o) => o.isFavorite);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />

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
    </BrowserRouter>
  );
}
