import type { City } from '../store/reducer';

type CitiesListProps = {
  cities: City[];
  currentCity: City;
  onSelect: (city: City) => void;
};

function CitiesList({ cities, currentCity, onSelect }: CitiesListProps) {
  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li className="locations__item" key={city}>
              <a
                className={`locations__item-link tabs__item ${
                  city === currentCity ? 'tabs__item--active' : ''
                }`}
                href="#"
                onClick={(evt) => {
                  evt.preventDefault();
                  onSelect(city);
                }}
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

export default CitiesList;
