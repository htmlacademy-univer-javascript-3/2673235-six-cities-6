import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReviewsList from '../components/ReviewsList';
import CommentForm from '../components/CommentForm';
import Map from '../components/Map';
import OffersList from '../components/OffersList';
import type { RootState, AppDispatch } from '../store';
import type { Offer } from '../store/reducer';
import { AuthorizationStatus } from '../store/const';
import { logoutAction } from '../store/action';
import type { Review } from '../types/review';

export default function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const offers = useSelector((state: RootState) => state.offers);
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus,
  );
  const user = useSelector((state: RootState) => state.user);

  const currentOffer: Offer | null =
    offers.find((offer) => offer.id === id) ?? null;

  if (!currentOffer) {
    return (
      <div className="page page--gray page--main">
        <header className="header">
          <div className="container">
            <div className="header__wrapper">
              <div className="header__left">
                <Link
                  className="header__logo-link header__logo-link--active"
                  to="/"
                >
                  <img
                    className="header__logo"
                    src="img/logo.svg"
                    alt="6 cities logo"
                    width="81"
                    height="41"
                  />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="page__main">
          <div className="container">
            <section className="property">
              <h1>Offer not found</h1>
              <Link to="/" className="button">
                Back to main page
              </Link>
            </section>
          </div>
        </main>
      </div>
    );
  }

  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  const nearOffers: Offer[] = offers
    .filter(
      (offer) =>
        offer.city === currentOffer.city && offer.id !== currentOffer.id,
    )
    .slice(0, 3);

  const ratingWidth = `${Math.round(currentOffer.rating) * 20}%`;

  const offerType =
    currentOffer.type.charAt(0).toUpperCase() + currentOffer.type.slice(1);

  const mapOffers: Offer[] = [currentOffer, ...nearOffers];

  const reviews: Review[] = [
    {
      id: 'r1',
      userName: 'Max',
      avatarUrl: 'img/avatar-max.jpg',
      rating: 4,
      comment:
        'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
      date: '2019-04-24',
    },
    {
      id: 'r2',
      userName: 'Angelina',
      avatarUrl: 'img/avatar-angelina.jpg',
      rating: 5,
      comment:
        'The house is very well located and is very comfortable. Beautiful interior and beautiful view from the window.',
      date: '2019-05-01',
    },
  ];

  const handleSignOutClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutAction());
  };

  const galleryImages = [
    'img/room.jpg',
    'img/apartment-01.jpg',
    'img/apartment-02.jpg',
    'img/apartment-03.jpg',
    'img/studio-01.jpg',
    'img/apartment-01.jpg',
  ];

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
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
                {isAuth && user ? (
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
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <a
                        className="header__nav-link"
                        href="#logout"
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

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {galleryImages.map((src) => (
                <div className="offer__image-wrapper" key={src}>
                  <img
                    className="offer__image"
                    src={src}
                    alt={currentOffer.title}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {currentOffer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}

              <div className="offer__name-wrapper">
                <h1 className="offer__name">{currentOffer.title}</h1>
                <button
                  className={`offer__bookmark-button button ${
                    currentOffer.isFavorite
                      ? 'offer__bookmark-button--active'
                      : ''
                  }`}
                  type="button"
                >
                  <svg
                    className="offer__bookmark-icon"
                    width="31"
                    height="33"
                  >
                    <use xlinkHref="#icon-bookmark" />
                  </svg>
                  <span className="visually-hidden">
                    {currentOffer.isFavorite
                      ? 'In bookmarks'
                      : 'To bookmarks'}
                  </span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {currentOffer.rating.toFixed(1)}
                </span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offerType}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  3 Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max 4 adults
                </li>
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">
                  €{currentOffer.price}
                </b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  <li className="offer__inside-item">Wi-Fi</li>
                  <li className="offer__inside-item">Washing machine</li>
                  <li className="offer__inside-item">Towels</li>
                  <li className="offer__inside-item">Heating</li>
                  <li className="offer__inside-item">Coffee machine</li>
                  <li className="offer__inside-item">Kitchen</li>
                  <li className="offer__inside-item">Dishwasher</li>
                  <li className="offer__inside-item">Cabel TV</li>
                  <li className="offer__inside-item">Fridge</li>
                </ul>
              </div>

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img
                      className="offer__avatar user__avatar"
                      src="img/avatar-angelina.jpg"
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">Angelina</span>
                  <span className="offer__user-status">Pro</span>
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    A quiet cozy and picturesque area that hides behind a
                    river by the unique lightness of Amsterdam.
                  </p>
                  <p className="offer__text">
                    The building is green and from 18th century.
                  </p>
                </div>
              </div>

              <div className="offer__reviews reviews">
                <ReviewsList items={reviews} />
                {isAuth && <CommentForm />}
              </div>
            </div>
          </div>

          <section className="offer__map map">
            <Map offers={mapOffers} activeOfferId={currentOffer.id} />
          </section>
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <OffersList offers={nearOffers} variant="near" />
          </section>
        </div>
      </main>
    </div>
  );
}
