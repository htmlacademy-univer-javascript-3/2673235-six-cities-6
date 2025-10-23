import { Link } from 'react-router-dom';
import type { Offer } from '../mocks/offers';

type OfferCardProps = {
  offer: Offer;
  onHover?: (id: string | null) => void;
  variant?: 'main' | 'favorites' | 'near';
};

export default function OfferCard({ offer, onHover, variant = 'main' }: OfferCardProps) {
  const { id, title, type, price, rating, isPremium, isFavorite, previewImage } = offer;

  let imgWidth = 260;
  let imgHeight = 200;
  if (variant === 'favorites') {
    imgWidth = 150;
    imgHeight = 110;
  }

  let cardClass = 'cities__card place-card';
  if (variant === 'favorites') {
    cardClass = 'favorites__card place-card';
  } else if (variant === 'near') {
    cardClass = 'near-places__card place-card';
  }

  let imgWrapperClass = 'cities__image-wrapper place-card__image-wrapper';
  if (variant === 'favorites') {
    imgWrapperClass = 'favorites__image-wrapper place-card__image-wrapper';
  } else if (variant === 'near') {
    imgWrapperClass = 'near-places__image-wrapper place-card__image-wrapper';
  }

  let bookmarkClass = 'place-card__bookmark-button button';
  if (isFavorite) {
    bookmarkClass = 'place-card__bookmark-button place-card__bookmark-button--active button';
  }

  let humanType = type;
  if (type.length > 0) {
    humanType = type.charAt(0).toUpperCase() + type.slice(1);
  }

  const ratingWidth = Math.round(rating) * 20;

  return (
    <article
      className={cardClass}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className={imgWrapperClass}>
        <Link to={`/offer/${id}`}>
          <img
            className="place-card__image"
            src={previewImage}
            width={imgWidth}
            height={imgHeight}
            alt={title}
          />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{price}</b>
            <span className="place-card__price-text">/ night</span>
          </div>

          <button className={bookmarkClass} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${ratingWidth}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <Link to={`/offer/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{humanType}</p>
      </div>
    </article>
  );
}
