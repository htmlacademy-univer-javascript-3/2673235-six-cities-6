import { useState } from 'react';
import type { Offer } from '../store/reducer';
import OfferCard from './OfferCard';

type OffersListProps = {
  offers: Offer[];
  variant?: 'main' | 'favorites' | 'near';
  onActiveChange?: (id: string | null) => void;
};

export default function OffersList({ offers, variant = 'main', onActiveChange }: OffersListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleHover = (id: string | null) => {
    setActiveId(id);
    if (onActiveChange) {
      onActiveChange(id);
    }
  };

  let listClass = 'cities__places-list places__list tabs__content';
  if (variant === 'favorites') {
    listClass = 'favorites__places';
  } else if (variant === 'near') {
    listClass = 'near-places__list places__list';
  }

  return (
    <div className={listClass} data-active-id={activeId ?? ''}>
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onHover={handleHover} variant={variant} />
      ))}
    </div>
  );
}
