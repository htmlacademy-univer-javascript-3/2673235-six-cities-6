import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/header';
import ErrorMessage from '../components/error-message';
import CitiesList from '../components/cities-list';
import OffersList from '../components/offers-list';
import Map from '../components/map';
import SortingOptions from '../components/sorting-options';
import Spinner from '../components/spinner';
import type { AppDispatch } from '../store';
import { changeCity } from '../store/action';
import { selectCity, selectIsOffersLoading, selectOffersForCity } from '../store/selectors';
import type { City, Offer } from '../store/types';
import type { SortType } from '../types/sort-type';

const CITIES: City[] = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

function sortOffers(offers: Offer[], sortType: SortType): Offer[] {
  if (sortType === 'Popular') {
    return offers;
  }

  const next = [...offers];

  if (sortType === 'PriceLowToHigh') {
    return next.sort((a, b) => a.price - b.price);
  }

  if (sortType === 'PriceHighToLow') {
    return next.sort((a, b) => b.price - a.price);
  }

  return next.sort((a, b) => b.rating - a.rating);
}

function MainPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const city = useSelector(selectCity);
  const offersForCity = useSelector(selectOffersForCity);
  const isOffersLoading = useSelector(selectIsOffersLoading);

  const [sortType, setSortType] = useState<SortType>('Popular');
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const sortedOffers = useMemo(() => sortOffers(offersForCity, sortType), [offersForCity, sortType]);

  const isEmpty = !isOffersLoading && sortedOffers.length === 0;

  const handleCitySelect = useCallback((nextCity: City) => {
    dispatch(changeCity(nextCity));
    setActiveOfferId(null);
    setSortType('Popular');
  }, [dispatch]);

  let content: JSX.Element;

  if (isOffersLoading) {
    content = <Spinner />;
  } else if (isEmpty) {
    content = (
      <div className="cities__places-container cities__places-container--empty container">
        <section className="cities__no-places">
          <div className="cities__status-wrapper tabs__content">
            <b className="cities__status">No places to stay available</b>
            <p className="cities__status-description">We could not find any property available at the moment in {city}</p>
          </div>
        </section>
        <div className="cities__right-section">
          <section className="cities__map map">
            <img src="img/no-places.png" alt="No places" />
          </section>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="cities__places-container container">
        <section className="cities__places places">
          <h2 className="visually-hidden">Places</h2>

          <b className="places__found">{sortedOffers.length} places to stay in {city}</b>

          <SortingOptions sortType={sortType} onChange={setSortType} />

          <OffersList offers={sortedOffers} variant="main" onActiveChange={setActiveOfferId} />
        </section>

        <div className="cities__right-section">
          <section className="cities__map map">
            <Map key={city} offers={sortedOffers} activeOfferId={activeOfferId} />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--gray page--main">
      <Header isLogoActive />
      <ErrorMessage />

      <main className={`page__main page__main--index ${isEmpty ? 'page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>

        <div className="tabs">
          <CitiesList cities={CITIES} currentCity={city} onSelect={handleCitySelect} />
        </div>

        <div className={`cities ${isEmpty ? 'cities--places-list-empty' : ''}`}>
          {content}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
