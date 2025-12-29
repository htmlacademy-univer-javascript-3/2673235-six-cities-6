import { memo, useCallback, type MouseEvent } from 'react';
import type { City } from '../store/types';

type CitiesListProps = {
  cities: City[];
  currentCity: City;
  onSelect: (city: City) => void;
};

function CitiesListComponent({ cities, currentCity, onSelect }: CitiesListProps): JSX.Element {
  const handleClick = useCallback(
    (city: City) => (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      onSelect(city);
    },
    [onSelect],
  );

  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((city) => (
          <li className="locations__item" key={city}>
            <a
              className={`locations__item-link tabs__item ${city === currentCity ? 'tabs__item--active' : ''}`}
              href="#"
              onClick={handleClick(city)}
            >
              <span>{city}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

const CitiesList = memo(CitiesListComponent);

export default CitiesList;
