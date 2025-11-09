import type { FC } from 'react';
import ReviewItem, { type Review } from './ReviewItem';

type Props = {
  items: Review[];
};

const ReviewsList: FC<Props> = ({ items }) => {
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const limited = sorted.slice(0, 10);

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{items.length}</span>
      </h2>

      <ul className="reviews__list">
        {limited.map((r) => (
          <ReviewItem key={r.id} review={r} />
        ))}
      </ul>
    </section>
  );
};

export default ReviewsList;
