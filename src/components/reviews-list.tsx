import { memo, type ReactNode } from 'react';
import type { Review } from '../types/review';
import ReviewItem from './review-item';

type ReviewsListProps = {
  items: Review[];
  totalCount: number;
  children?: ReactNode;
};

function ReviewsListComponent({ items, totalCount, children }: ReviewsListProps): JSX.Element {
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews • <span className="reviews__amount">{totalCount}</span>
      </h2>

      {children}

      <ul className="reviews__list">
        {items.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </section>
  );
}

const ReviewsList = memo(ReviewsListComponent);

export default ReviewsList;
