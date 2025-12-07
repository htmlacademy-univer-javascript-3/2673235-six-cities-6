import { useState } from 'react';
import type { SortType } from '../types/sort-type';

type SortingOptionsProps = {
  sortType: SortType;
  onChange: (value: SortType) => void;
};

const SORTING_OPTIONS: { value: SortType; label: string }[] = [
  { value: 'Popular', label: 'Popular' },
  { value: 'PriceLowToHigh', label: 'Price: low to high' },
  { value: 'PriceHighToLow', label: 'Price: high to low' },
  { value: 'TopRatedFirst', label: 'Top rated first' },
];

function SortingOptions({ sortType, onChange }: SortingOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: SortType) => {
    onChange(value);
    setIsOpen(false);
  };

  const currentLabel =
    SORTING_OPTIONS.find((option) => option.value === sortType)?.label ??
    'Popular';

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>{' '}
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleToggle}
      >
        {currentLabel}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select" />
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpen ? 'places__options--opened' : ''
        }`}
      >
        {SORTING_OPTIONS.map((option) => (
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

export default SortingOptions;
