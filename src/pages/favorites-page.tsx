import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import ErrorMessage from '../components/error-message';
import Spinner from '../components/spinner';
import OffersList from '../components/offers-list';
import type { AppDispatch } from '../store';
import { fetchFavorites } from '../store/action';
import { selectFavorites, selectIsFavoritesLoading } from '../store/selectors';
import type { Offer } from '../store/types';

type Grouped = Record<string, Offer[]>;

function groupOffers(offers: Offer[]): Grouped {
  return offers.reduce((acc, offer) => {
    const city = offer.city;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(offer);
    return acc;
  }, {} as Grouped);
}

function FavoritesPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector(selectFavorites);
  const isFavoritesLoading = useSelector(selectIsFavoritesLoading);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const grouped = useMemo(() => groupOffers(favorites), [favorites]);
  const cities = Object.keys(grouped);

  const isEmpty = !isFavoritesLoading && favorites.length === 0;

  let content: JSX.Element;

  if (isFavoritesLoading) {
    content = <Spinner />;
  } else if (isEmpty) {
    content = (
      <div className="favorites__status-wrapper">
        <b className="favorites__status">Nothing yet saved.</b>
        <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
      </div>
    );
  } else {
    content = (
      <ul className="favorites__list">
        {cities.map((city) => (
          <li className="favorites__locations-items" key={city}>
            <div className="favorites__locations locations locations--current">
              <div className="locations__item">
                <Link className="locations__item-link" to="/">
                  <span>{city}</span>
                </Link>
              </div>
            </div>

            <OffersList offers={grouped[city]} variant="favorites" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={`page ${isEmpty ? 'page--favorites-empty' : ''}`}>
      <Header />
      <ErrorMessage />

      <main className={`page__main page__main--favorites ${isEmpty ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          <section className={`favorites ${isEmpty ? 'favorites--empty' : ''}`}>
            <h1 className="favorites__title">Saved listing</h1>
            {content}
          </section>
        </div>
      </main>

      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;
