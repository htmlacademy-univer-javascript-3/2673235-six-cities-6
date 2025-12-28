import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { postComment } from '../store/action';

type CommentFormProps = {
  offerId: string;
};

function titleFor(star: number) {
  if (star === 5) {
    return 'perfect';
  }
  if (star === 4) {
    return 'good';
  }
  if (star === 3) {
    return 'not bad';
  }
  if (star === 2) {
    return 'badly';
  }
  return 'terribly';
}

export default function CommentForm({ offerId }: CommentFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isSending = useSelector((state: RootState) => state.isCommentSending);

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isValid =
    rating !== null && comment.length >= 50 && comment.length <= 300;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid || rating === null) {
      return;
    }

    setError(null);

    dispatch(postComment({ offerId, comment, rating }))
      .then(() => {
        setRating(null);
        setComment('');
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status;

        if (status === 401) {
          setError('You need to sign in to send a review.');
          return;
        }

        if (status === 404) {
          setError('Offer not found. Try to open it again from the main page.');
          return;
        }

        setError('Failed to send review. Please try again.');
      });
  };

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>

      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((star) => (
          <Fragment key={star}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={star}
              id={`${star}-stars`}
              type="radio"
              checked={rating === star}
              disabled={isSending}
              onChange={() => setRating(star)}
            />
            <label
              htmlFor={`${star}-stars`}
              className="reviews__rating-label form__rating-label"
              title={titleFor(star)}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={comment}
        disabled={isSending}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
        </p>

        {error && <p style={{ color: 'red', margin: '0 0 10px' }}>{error}</p>}

        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isValid || isSending}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
