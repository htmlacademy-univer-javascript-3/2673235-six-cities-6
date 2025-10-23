import { useState } from 'react';

function titleFor(star: number) {
  if (star === 5) return 'perfect';
  if (star === 4) return 'good';
  if (star === 3) return 'not bad';
  if (star === 2) return 'badly';
  return 'terribly';
}

export default function CommentForm() {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const isValid = rating !== null && comment.length >= 50 && comment.length <= 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    setRating(null);
    setComment('');
  };

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>

      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((star) => (
          <span key={star}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={star}
              id={`${star}-stars`}
              type="radio"
              checked={rating === star}
              onChange={() => setRating(star)}
            />
            <label htmlFor={`${star}-stars`} className="reviews__rating-label form__rating-label" title={titleFor(star)}>
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </span>
        ))}
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit" disabled={!isValid}>
          Submit
        </button>
      </div>
    </form>
  );
}
