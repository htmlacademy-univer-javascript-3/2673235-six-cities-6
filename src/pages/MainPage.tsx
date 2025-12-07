import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { changeCity } from '../store/action';
import type { City, Offer } from '../store/reducer';
import OffersList from '../components/OffersList';
import Map from '../components/Map';
import CitiesList from '../components/CitiesList';
import SortingOptions, { type SortType } from '../components/SortingOptions';
import Spinner from '../components/Spinner';

export default function MainPage() {
  const dispatch = useDispatch();
  const city = useSelector((s: RootState) => s.city);
  const allOffers = useSelector((s: RootState) => s.offers);
  const isOffersLoading = useSelector((s: RootState) => s.isOffersLoading);

  const cities: City[] = useMemo(
    () => ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'],
    [],
  );

  const filtered: Offer[] = useMemo(
    () => allOffers.filter((o) => o.city === city),
    [allOffers, city],
  );

  const [sortType, setSortType] = useState<SortType>('Popular');
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const sortedOffers: Offer[] = useMemo(() => {
    const copy = [...filtered];

    if (sortType === 'PriceLowToHigh') {
      copy.sort((a, b) => a.price - b.price);
    } else if (sortType === 'PriceHighToLow') {
      copy.sort((a, b) => b.price - a.price);
    } else if (sortType === 'TopRatedFirst') {
      copy.sort((a, b) => b.rating - a.rating);
    }

    return copy;
  }, [filtered, sortType]);

  const onSelectCity = (c: City) => {
    dispatch(changeCity(c));
    setActiveOfferId(null);
  };

  const handleActiveOfferChange = (id: string | null) => {
    setActiveOfferId(id);
  };

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active" href="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#todo">
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#todo">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>

        <CitiesList cities={cities} currentCity={city} onSelect={onSelectCity} />

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              {isOffersLoading ? (
                <Spinner />
              ) : (
                <>
                  <h2 className="visually-hidden">Places</h2>
                  <b className="places__found">
                    {sortedOffers.length} places to stay in {city}
                  </b>

                  <SortingOptions sortType={sortType} onChange={setSortType} />

                  <OffersList
                    offers={sortedOffers}
                    onActiveChange={handleActiveOfferChange}
                  />
                </>
              )}
            </section>

            {!isOffersLoading && (
              <div className="cities__right-section">
                <section className="cities__map map">
                  <Map offers={sortedOffers} activeOfferId={activeOfferId} />
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
