import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReviewsList from '../components/ReviewsList';
import CommentForm from '../components/CommentForm';
import Map from '../components/Map';
import OffersList from '../components/OffersList';
import Spinner from '../components/Spinner';
import type { RootState, AppDispatch } from '../store';
import type { Offer } from '../store/reducer';
import { AuthorizationStatus } from '../store/const';
import { fetchOfferById, logoutAction } from '../store/action';

export default function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus,
  );
  const user = useSelector((state: RootState) => state.user);

  const offer = useSelector((state: RootState) => state.offer);
  const nearOffers = useSelector((state: RootState) => state.nearOffers);
  const reviews = useSelector((state: RootState) => state.reviews);

  const isOfferLoading = useSelector(
    (state: RootState) => state.isOfferLoading,
  );
  const isOfferNotFound = useSelector(
    (state: RootState) => state.isOfferNotFound,
  );

  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferById(id));
    }
  }, [dispatch, id]);

  const handleSignOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logoutAction());
  };

  if (!id) {
    return <Navigate to="/404" replace />;
  }

  if (isOfferNotFound) {
    return <Navigate to="/404" replace />;
  }

  if (isOfferLoading || !offer) {
    return (
      <div className="page">
        <Spinner />
      </div>
    );
  }

  const galleryImages = offer.images.slice(0, 6);
  const nearOffersLimited = nearOffers.slice(0, 3);

  const ratingWidth = `${Math.round(offer.rating) * 20}%`;

  const offerType =
    offer.type.charAt(0).toUpperCase() + offer.type.slice(1);

  const bedroomsText =
    offer.bedrooms === 1 ? '1 Bedroom' : `${offer.bedrooms} Bedrooms`;

  const adultsText =
    offer.maxAdults === 1 ? 'Max 1 adult' : `Max ${offer.maxAdults} adults`;

  const avatarWrapperClass = offer.host.isPro
    ? 'offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper'
    : 'offer__avatar-wrapper user__avatar-wrapper';

  const mapOffers: Offer[] = [offer, ...nearOffersLimited];

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
                  <img className="offer__image" src={src} alt={offer.title} />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}

              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <button
                  className={`offer__bookmark-button button ${
                    offer.isFavorite ? 'offer__bookmark-button--active' : ''
                  }`}
                  type="button"
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark" />
                  </svg>
                  <span className="visually-hidden">
                    {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {offer.rating.toFixed(1)}
                </span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offerType}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedroomsText}
                </li>
                <li className="offer__feature offer__feature--adults">
                  {adultsText}
                </li>
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">€{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((good) => (
                    <li className="offer__inside-item" key={good}>
                      {good}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={avatarWrapperClass}>
                    <img
                      className="offer__avatar user__avatar"
                      src={offer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{offer.host.name}</span>
                  {offer.host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>

              <div className="offer__reviews reviews">
                <ReviewsList items={reviews} />
                {isAuth && <CommentForm offerId={offer.id} />}
              </div>
            </div>
          </div>

          <section className="offer__map map">
            <Map offers={mapOffers} activeOfferId={offer.id} />
          </section>
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <OffersList offers={nearOffersLimited} variant="near" />
          </section>
        </div>
      </main>
    </div>
  );
}
