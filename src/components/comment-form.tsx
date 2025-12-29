import { Fragment, useCallback, useMemo, useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import { postComment } from '../store/action';
import { selectIsCommentSending, selectOffer } from '../store/selectors';

type CommentFormProps = {
  offerId: string;
};

function titleFor(star: number): string {
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

function CommentForm({ offerId }: CommentFormProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const isCommentSending = useSelector(selectIsCommentSending);
  const offer = useSelector(selectOffer);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const currentOfferId = offer?.id ?? offerId;

  const isValid = useMemo(() => {
    const length = comment.trim().length;
    return rating >= 1 && rating <= 5 && length >= 50 && length <= 300;
  }, [comment, rating]);

  const handleSubmit = useCallback((evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!isValid || isCommentSending) {
      return;
    }

    void (async () => {
      try {
        await dispatch(postComment(currentOfferId, comment.trim(), rating));
        setRating(0);
        setComment('');
      } catch {
        void 0;
      }
    })();
  }, [comment, currentOfferId, dispatch, isCommentSending, isValid, rating]);

  return (
    <form className="reviews__form form" action="#" onSubmit={handleSubmit}>
      <fieldset disabled={isCommentSending}>
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
                onChange={() => setRating(star)}
              />
              <label
                className="reviews__rating-label form__rating-label"
                htmlFor={`${star}-stars`}
                title={titleFor(star)}
              >
                <svg className="form__star-image" width="37" height="33">
                  <use xlinkHref="#icon-star" />
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
          onChange={(evt) => setComment(evt.target.value)}
        />

        <div className="reviews__button-wrapper">
          <p className="reviews__help">
            To submit review please make sure to set{' '}
            <span className="reviews__star">rating</span> and describe your stay with at least{' '}
            <span className="reviews__star">50 characters</span>.
          </p>
          <button className="reviews__submit form__submit button" type="submit" disabled={!isValid || isCommentSending}>
            Submit
          </button>
        </div>
      </fieldset>
    </form>
  );
}

export default CommentForm;
