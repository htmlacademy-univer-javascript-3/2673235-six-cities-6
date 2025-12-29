import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/header';
import ErrorMessage from '../components/error-message';
import type { AppDispatch } from '../store';
import { changeCity, loginAction } from '../store/action';
import { AuthorizationStatus } from '../store/const';
import { selectAuthorizationStatus } from '../store/selectors';
import type { City } from '../store/types';

const CITIES: City[] = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
const PASSWORD_REGEXP = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

function LoginPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authorizationStatus = useSelector(selectAuthorizationStatus);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const randomCity = useMemo(() => CITIES[Math.floor(Math.random() * CITIES.length)], []);

  const canSubmit = email.trim().length > 0 && PASSWORD_REGEXP.test(password.trim());

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (canSubmit) {
      void dispatch(loginAction({ email, password }))
        .then(() => navigate('/'))
        .catch(() => undefined);
    }
  };

  const handleEmailChange = (evt: ChangeEvent<HTMLInputElement>) => setEmail(evt.target.value);

  const handlePasswordChange = (evt: ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value);

  const handleCityClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();

    dispatch(changeCity(randomCity));
    navigate('/');
  };

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="page page--gray page--login">
      <Header />
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden" htmlFor="email">E-mail</label>
                <input
                  className="login__input form__input"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden" htmlFor="password">Password</label>
                <input
                  className="login__input form__input"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <button className="login__submit form__submit button" type="submit" disabled={!canSubmit}>
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#" onClick={handleCityClick}>
                <span>{randomCity}</span>
              </a>
            </div>
          </section>
        </div>
      </main>
      <ErrorMessage />
    </div>
  );
}

export default LoginPage;
