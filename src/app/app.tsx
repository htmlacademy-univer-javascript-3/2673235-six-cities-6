import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from '../pages/main-page';
import LoginPage from '../pages/login-page';
import FavoritesPage from '../pages/favorites-page';
import OfferPage from '../pages/offer-page';
import NotFoundPage from '../pages/not-found-page';
import PrivateRoute from '../hocs/private-route';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={(
          <PrivateRoute>
            <FavoritesPage />
          </PrivateRoute>
        )}
      />
      <Route path="/offer/:id" element={<OfferPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}

export default App;
