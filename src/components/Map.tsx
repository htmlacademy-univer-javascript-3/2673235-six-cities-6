import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Offer } from '../mocks/offers';

type MapProps = {
  offers: Offer[];
  activeOfferId?: string | null;
};

const defaultIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

const activeIcon = L.icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

export default function Map({ offers, activeOfferId }: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const center: [number, number] =
      offers.length > 0
        ? [offers[0].location.lat, offers[0].location.lng]
        : [52.374, 4.889];

    mapRef.current = L.map(containerRef.current).setView(center, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);
  }, [offers]);

  useEffect(() => {
    if (!markersRef.current) {
      return;
    }

    markersRef.current.clearLayers();

    offers.forEach((offer) => {
      const icon = offer.id === activeOfferId ? activeIcon : defaultIcon;

      L.marker(
        [offer.location.lat, offer.location.lng],
        { icon }
      ).addTo(markersRef.current as L.LayerGroup);
    });
  }, [offers, activeOfferId]);

  return <div style={{ height: '100%' }} ref={containerRef}></div>;
}
