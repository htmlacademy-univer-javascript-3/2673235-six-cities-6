import { memo, useCallback, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { Offer } from '../store/types';
import type { AppDispatch } from '../store';
import { AuthorizationStatus } from '../store/const';
import { toggleFavorite } from '../store/action';
import { selectAuthorizationStatus } from '../store/selectors';

type OfferCardProps = {
  offer: Offer;
  onHover?: (id: string | null) => void;
  variant?: 'main' | 'favorites' | 'near';
};

function formatType(t: Offer['type']): string {
  switch (t) {
    case 'apartment':
      return 'Apartment';
    case 'room':
      return 'Room';
    case 'house':
      return 'House';
    case 'hotel':
      return 'Hotel';
  }
}

function OfferCardComponent({ offer, onHover, variant = 'main' }: OfferCardProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authorizationStatus = useSelector(selectAuthorizationStatus);

  const handleMouseEnter = useCallback(() => {
    onHover?.(offer.id);
  }, [onHover, offer.id]);

  const handleMouseLeave = useCallback(() => {
    onHover?.(null);
  }, [onHover]);

  const handleBookmarkClick = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();

      if (authorizationStatus !== AuthorizationStatus.Auth) {
        navigate('/login');
        return;
      }

      const nextStatus: 0 | 1 = offer.isFavorite ? 0 : 1;
      dispatch(toggleFavorite(offer.id, nextStatus));
    },
    [authorizationStatus, dispatch, navigate, offer.id, offer.isFavorite],
  );

  const {
    id,
    title,
    previewImage,
    isPremium,
    isFavorite,
    price,
    rating,
  } = offer;

  const ratingWidth = Math.round(rating) * 20;

  let articleClass = 'cities__card place-card';
  let imgWrapperClass = 'cities__image-wrapper place-card__image-wrapper';
  let imgWidth = 260;
  let imgHeight = 200;

  if (variant === 'near') {
    articleClass = 'near-places__card place-card';
    imgWrapperClass = 'near-places__image-wrapper place-card__image-wrapper';
    imgWidth = 260;
    imgHeight = 200;
  }

  if (variant === 'favorites') {
    articleClass = 'favorites__card place-card';
    imgWrapperClass = 'favorites__image-wrapper place-card__image-wrapper';
    imgWidth = 150;
    imgHeight = 110;
  }

  return (
    <article className={articleClass} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className={imgWrapperClass}>
        <Link to={`/offer/${id}`}>
          <img className="place-card__image" src={previewImage} width={imgWidth} height={imgHeight} alt={title} />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{price}</b>
            <span className="place-card__price-text">/ night</span>
          </div>

          <button
            className={`place-card__bookmark-button button ${isFavorite ? 'place-card__bookmark-button--active' : ''}`}
            type="button"
            onClick={handleBookmarkClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${ratingWidth}%` }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <Link to={`/offer/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{formatType(offer.type)}</p>
      </div>
    </article>
  );
}

const OfferCard = memo(OfferCardComponent);

export default OfferCard;
