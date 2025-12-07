import type { MouseEvent } from 'react';
import type { City } from '../store/reducer';

type CitiesListProps = {
  cities: City[];
  currentCity: City;
  onSelect: (city: City) => void;
};

export default function CitiesList({ cities, currentCity, onSelect }: CitiesListProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>, city: City) => {
    e.preventDefault();
    if (city !== currentCity) {
      onSelect(city);
    }
  };

  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li className="locations__item" key={city}>
              <a
                className={`locations__item-link tabs__item ${city === currentCity ? 'tabs__item--active' : ''}`}
                href="#"
                onClick={(e) => handleClick(e, city)}
              >
                <span>{city}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
