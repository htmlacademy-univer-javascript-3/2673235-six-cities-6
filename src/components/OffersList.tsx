import { memo, useCallback, useState } from 'react';
import type { Offer } from '../store/reducer';
import OfferCard from './OfferCard';

type OffersListProps = {
  offers: Offer[];
  variant?: 'main' | 'favorites' | 'near';
  onActiveChange?: (id: string | null) => void;
};

function OffersListComponent({
  offers,
  variant = 'main',
  onActiveChange,
}: OffersListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleHover = useCallback(
    (id: string | null) => {
      setActiveId(id);

      if (onActiveChange) {
        onActiveChange(id);
      }
    },
    [onActiveChange],
  );

  let listClass = 'near-places__list places__list';

  if (variant === 'main') {
    listClass = 'cities__places-list places__list tabs__content';
  } else if (variant === 'favorites') {
    listClass = 'favorites__places';
  }

  return (
    <div className={listClass} data-active-id={activeId ?? ''}>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onHover={handleHover}
          variant={variant}
        />
      ))}
    </div>
  );
}

export const OffersList = memo(OffersListComponent);
export default OffersList;
