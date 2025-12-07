import { useState } from 'react';

export type SortType =
  | 'Popular'
  | 'PriceLowToHigh'
  | 'PriceHighToLow'
  | 'TopRatedFirst';

type SortingOptionsProps = {
  sortType: SortType;
  onChange: (value: SortType) => void;
};

export default function SortingOptions({ sortType, onChange }: SortingOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: SortType; label: string }[] = [
    { value: 'Popular', label: 'Popular' },
    { value: 'PriceLowToHigh', label: 'Price: low to high' },
    { value: 'PriceHighToLow', label: 'Price: high to low' },
    { value: 'TopRatedFirst', label: 'Top rated first' },
  ];

  const current = options.find((o) => o.value === sortType) ?? options[0];

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: SortType) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleToggle}
      >
        {current.label}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpen ? 'places__options--opened' : ''
        }`}
      >
        {options.map((option) => (
          <li
            key={option.value}
            className={`places__option ${
              option.value === sortType ? 'places__option--active' : ''
            }`}
            tabIndex={0}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </form>
  );
}
