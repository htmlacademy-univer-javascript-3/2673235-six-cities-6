import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/header';
import ErrorMessage from '../components/error-message';
import ReviewsList from '../components/reviews-list';
import CommentForm from '../components/comment-form';
import Map from '../components/map';
import OffersList from '../components/offers-list';
import Spinner from '../components/spinner';
import type { AppDispatch } from '../store';
import type { Offer } from '../store/types';
import { AuthorizationStatus } from '../store/const';
import { fetchOfferById, toggleFavorite } from '../store/action';
import {
  selectAuthorizationStatus,
  selectIsOfferLoading,
  selectIsOfferNotFound,
  selectNearOffersLimited,
  selectOffer,
  selectSortedReviewsLimited,
  selectReviews,
} from '../store/selectors';

function OfferPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const offer = useSelector(selectOffer);
  const nearOffersLimited = useSelector(selectNearOffersLimited);
  const reviews = useSelector(selectReviews);
  const sortedReviewsLimited = useSelector(selectSortedReviewsLimited);

  const authorizationStatus = useSelector(selectAuthorizationStatus);

  const isOfferLoading = useSelector(selectIsOfferLoading);
  const isOfferNotFound = useSelector(selectIsOfferNotFound);

  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  const mapOffers: Offer[] = useMemo(() => {
    if (!offer) {
      return [];
    }
    return [offer, ...nearOffersLimited];
  }, [offer, nearOffersLimited]);

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch(fetchOfferById(id));
  }, [dispatch, id]);

  const handleBookmarkClick = useCallback(() => {
    if (!offer) {
      return;
    }

    if (!isAuth) {
      navigate('/login');
      return;
    }

    const nextStatus: 0 | 1 = offer.isFavorite ? 0 : 1;
    dispatch(toggleFavorite(offer.id, nextStatus));
  }, [dispatch, isAuth, navigate, offer]);

  if (isOfferNotFound) {
    return <Navigate to="/404" />;
  }

  if (isOfferLoading) {
    return <Spinner />;
  }

  if (!offer) {
    return (
      <div className="page">
        <Header />
        <ErrorMessage />
        <main className="page__main page__main--offer">
          <div className="container" style={{ padding: '40px 0' }}>
            <h1>Offer is not available</h1>
            <Link to="/">Go to main</Link>
          </div>
        </main>
      </div>
    );
  }

  const galleryImages = offer.images.slice(0, 6);
  const ratingWidth = `${Math.round(offer.rating) * 20}%`;

  const offerType = offer.type.charAt(0).toUpperCase() + offer.type.slice(1);
  const bedroomsText = offer.bedrooms === 1 ? '1 Bedroom' : `${offer.bedrooms} Bedrooms`;
  const adultsText = offer.maxAdults === 1 ? 'Max 1 adult' : `Max ${offer.maxAdults} adults`;

  return (
    <div className="page">
      <Header />
      <ErrorMessage />

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {galleryImages.map((src) => (
                <div className="offer__image-wrapper" key={src}>
                  <img className="offer__image" src={src} alt="Photo studio" />
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
                  className={`offer__bookmark-button button ${offer.isFavorite ? 'offer__bookmark-button--active' : ''}`}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{offerType}</li>
                <li className="offer__feature offer__feature--bedrooms">{bedroomsText}</li>
                <li className="offer__feature offer__feature--adults">{adultsText}</li>
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">€{offer.price}</b>
                <span className="offer__price-text">night</span>
              </div>

              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((item) => (
                    <li className="offer__inside-item" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper user__avatar-wrapper ${offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''}`}>
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">{offer.host.name}</span>
                  {offer.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>

              <ReviewsList items={sortedReviewsLimited} totalCount={reviews.length}>
                {isAuth && id && <CommentForm offerId={id} />}
              </ReviewsList>
            </div>
          </div>

          <section className="offer__map map">
            <Map offers={mapOffers} activeOfferId={offer.id} />
          </section>
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OffersList offers={nearOffersLimited} variant="near" />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
