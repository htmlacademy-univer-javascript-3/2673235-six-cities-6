import type { City } from '../store/reducer';

type Props = {
  cities: City[];
  currentCity: City;
  onSelect: (c: City) => void;
};

export default function CitiesList({ cities, currentCity, onSelect }: Props) {
  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((c) => (
            <li className="locations__item" key={c}>
              <a
                className={
                  c === currentCity
                    ? 'locations__item-link tabs__item tabs__item--active'
                    : 'locations__item-link tabs__item'
                }
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(c);
                }}
              >
                <span>{c}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
