import { useMemo, useState, type MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { changeCity, logoutAction } from '../store/action';
import { AuthorizationStatus } from '../store/const';
import type { City, Offer } from '../store/reducer';
import OffersList from '../components/OffersList';
import Map from '../components/Map';
import CitiesList from '../components/CitiesList';
import SortingOptions, { type SortType } from '../components/SortingOptions';
import Spinner from '../components/Spinner';

export default function MainPage() {
  const dispatch = useDispatch<AppDispatch>();

  const city = useSelector((state: RootState) => state.city);
  const allOffers = useSelector((state: RootState) => state.offers);
  const isOffersLoading = useSelector((state: RootState) => state.isOffersLoading);
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus,
  );
  const user = useSelector((state: RootState) => state.user);

  const cities: City[] = useMemo(
    () => ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'],
    [],
  );

  const [sortType, setSortType] = useState<SortType>('Popular');
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const offersForCity: Offer[] = useMemo(
    () => allOffers.filter((offer) => offer.city === city),
    [allOffers, city],
  );

  const sortedOffers: Offer[] = useMemo(() => {
    const copy = [...offersForCity];

    if (sortType === 'PriceLowToHigh') {
      copy.sort((a, b) => a.price - b.price);
    } else if (sortType === 'PriceHighToLow') {
      copy.sort((a, b) => b.price - a.price);
    } else if (sortType === 'TopRatedFirst') {
      copy.sort((a, b) => b.rating - a.rating);
    }

    return copy;
  }, [offersForCity, sortType]);

  const onSelectCity = (value: City) => {
    dispatch(changeCity(value));
  };

  const handleSortChange = (value: SortType) => {
    setSortType(value);
  };

  const handleOfferHover = (id: string | null) => {
    setActiveOfferId(id);
  };

  const handleSignOutClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutAction());
  };

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link header__logo-link--active" to="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {authorizationStatus === AuthorizationStatus.Auth && user ? (
                  <>
                    <li className="header__nav-item user">
                      <Link
                        className="header__nav-link header__nav-link--profile"
                        to="/favorites"
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper" />
                        <span className="header__user-name user__name">
                          {user.email}
                        </span>
                        <span className="header__favorite-count">3</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <a
                        className="header__nav-link"
                        href="#"
                        onClick={handleSignOutClick}
                      >
                        <span className="header__signout">Sign out</span>
                      </a>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to="/login"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper" />
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
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
              <h2 className="visually-hidden">Places</h2>

              {isOffersLoading ? (
                <Spinner />
              ) : (
                <>
                  <b className="places__found">
                    {sortedOffers.length} places to stay in {city}
                  </b>

                  <SortingOptions sortType={sortType} onChange={handleSortChange} />

                  <OffersList
                    offers={sortedOffers}
                    onActiveChange={handleOfferHover}
                  />
                </>
              )}
            </section>

            <div className="cities__right-section">
              <section className="cities__map map">
                <Map offers={sortedOffers} activeOfferId={activeOfferId} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
