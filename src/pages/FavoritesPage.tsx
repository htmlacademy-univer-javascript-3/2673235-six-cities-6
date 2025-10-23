import OffersList from '../components/OffersList';
import type { Offer } from '../mocks/offers';

type FavoritesPageProps = {
  offers: Offer[];
};

export default function FavoritesPage({ offers }: FavoritesPageProps) {
  const grouped = offers.reduce<Record<string, Offer[]>>((acc, offer) => {
    if (!acc[offer.city]) {
      acc[offer.city] = [];
    }
    acc[offer.city].push(offer);
    return acc;
  }, {});

  const cities = Object.keys(grouped);

  let content = <p style={{ padding: 16 }}>Nothing yet saved</p>;
  if (cities.length > 0) {
    content = (
      <ul className="favorites__list">
        {cities.map((city) => (
          <li className="favorites__locations-items" key={city}>
            <div className="favorites__locations locations locations--current">
              <div className="locations__item">
                <a className="locations__item-link" href="#todo">
                  <span>{city}</span>
                </a>
              </div>
            </div>
            <OffersList offers={grouped[city]} variant="favorites" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#todo">
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">{offers.length}</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#todo">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            {content}
          </section>
        </div>
      </main>

      <footer className="footer container">
        <a className="footer__logo-link" href="/">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </a>
      </footer>
    </div>
  );
}
