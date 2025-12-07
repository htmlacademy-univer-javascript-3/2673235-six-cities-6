import type { Review } from '../types/review';
import ReviewItem from './ReviewItem';

type ReviewsListProps = {
  items: Review[];
};

function ReviewsList({ items }: ReviewsListProps) {
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const limited = sorted.slice(0, 10);

  return (
    <section className="property__reviews reviews">
      <h2 className="reviews__title">
        Reviews • <span className="reviews__amount">{limited.length}</span>
      </h2>
      <ul className="reviews__list">
        {limited.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </section>
  );
}

export default ReviewsList;
