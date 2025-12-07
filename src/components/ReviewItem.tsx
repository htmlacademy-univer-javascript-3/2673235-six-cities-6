import type { Review } from '../types/review';

type ReviewItemProps = {
  review: Review;
};

function toISODate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

function toMonthYear(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function ReviewItem({ review }: ReviewItemProps) {
  const ratingWidth = `${Math.round(review.rating) * 20}%`;
  const avatar = review.avatarUrl ?? 'img/avatar.svg';

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={avatar}
            alt={review.userName}
            width="54"
            height="54"
          />
        </div>
        <span className="reviews__user-name">{review.userName}</span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: ratingWidth }} />
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
}

export default ReviewItem;
