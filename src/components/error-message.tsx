import type { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../store/action';
import { selectError } from '../store/selectors';
import type { AppDispatch } from '../store';

function ErrorMessage(): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector(selectError);

  if (!error) {
    return null;
  }

  const handleCloseClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    dispatch(setError(null));
  };

  return (
    <div style={{ margin: '0 auto', maxWidth: '1144px', padding: '12px 16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          border: '1px solid rgba(0,0,0,0.15)',
          borderRadius: '6px',
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 230, 230, 0.6)',
        }}
      >
        <p style={{ margin: 0 }}>{error}</p>
        <button
          type="button"
          onClick={handleCloseClick}
          style={{
            border: '1px solid rgba(0,0,0,0.2)',
            borderRadius: '4px',
            padding: '6px 10px',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ErrorMessage;
