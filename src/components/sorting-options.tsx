import { memo, useCallback, useState } from 'react';
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

function SortingOptionsComponent({ sortType, onChange }: SortingOptionsProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = SORTING_OPTIONS.find((o) => o.value === sortType)?.label ?? 'Popular';

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (value: SortType) => {
      onChange(value);
      setIsOpen(false);
    },
    [onChange],
  );

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span className="places__sorting-type" tabIndex={0} onClick={handleToggle}>
        {selectedLabel}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select" />
        </svg>
      </span>

      <ul className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
        {SORTING_OPTIONS.map((option) => (
          <li
            key={option.value}
            className={`places__option ${option.value === sortType ? 'places__option--active' : ''}`}
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

const SortingOptions = memo(SortingOptionsComponent);

export default SortingOptions;
