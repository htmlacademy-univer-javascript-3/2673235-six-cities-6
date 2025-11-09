import type { FC } from 'react';

export type Review = {
  id: string;
  userName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
};

type Props = {
  review: Review;
};

function toMonthYear(s: string) {
  const d = new Date(s);
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function toISODate(s: string) {
  const d = new Date(s);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

const ReviewItem: FC<Props> = ({ review }) => {
  const width = Math.round(review.rating) * 20;

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          {review.avatarUrl ? (
            <img
              className="reviews__avatar user__avatar"
              src={review.avatarUrl}
              width={54}
              height={54}
              alt="Reviews avatar"
            />
          ) : null}
        </div>
        <span className="reviews__user-name">{review.userName}</span>
      </div>

      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: `${width}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <p className="reviews__text">{review.comment}</p>

        <time className="reviews__time" dateTime={toISODate(review.date)}>
          {toMonthYear(review.date)}
        </time>
      </div>
    </li>
  );
};

export default ReviewItem;
