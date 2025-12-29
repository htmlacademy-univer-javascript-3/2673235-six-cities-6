import { memo, useCallback } from 'react';
import type { Offer } from '../store/types';
import OfferCard from './offer-card';

type OffersListProps = {
  offers: Offer[];
  variant?: 'main' | 'favorites' | 'near';
  onActiveChange?: (id: string | null) => void;
};

function OffersListComponent({ offers, variant = 'main', onActiveChange }: OffersListProps): JSX.Element {
  const handleHover = useCallback(
    (id: string | null) => {
      onActiveChange?.(id);
    },
    [onActiveChange],
  );

  let listClass = 'cities__places-list places__list tabs__content';

  if (variant === 'near') {
    listClass = 'near-places__list places__list';
  }

  if (variant === 'favorites') {
    listClass = 'favorites__places';
  }

  return (
    <div className={listClass}>
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onHover={handleHover} variant={variant} />
      ))}
    </div>
  );
}

const OffersList = memo(OffersListComponent);

export default OffersList;
