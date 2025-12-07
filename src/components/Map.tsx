import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, LayerGroup } from 'leaflet';
import type { Offer } from '../store/reducer';

type MapProps = {
  offers: Offer[];
  activeOfferId?: string | null;
};

const defaultIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39] as [number, number],
  iconAnchor: [13.5, 39] as [number, number],
});

const activeIcon = L.icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39] as [number, number],
  iconAnchor: [13.5, 39] as [number, number],
});

export default function Map({ offers, activeOfferId }: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || offers.length === 0) {
      return;
    }

    const firstOffer = offers[0];
    const center: [number, number] = [
      firstOffer.location.lat,
      firstOffer.location.lng,
    ];
    const zoom = firstOffer.location.zoom;

    const map = L.map(containerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const markers = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersRef.current = markers;
  }, [offers]);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) {
      return;
    }

    markersRef.current.clearLayers();

    offers.forEach((offer) => {
      const icon = offer.id === activeOfferId ? activeIcon : defaultIcon;

      const position: [number, number] = [
        offer.location.lat,
        offer.location.lng,
      ];

      L.marker(position, { icon }).addTo(markersRef.current as LayerGroup);
    });
  }, [offers, activeOfferId]);

  return <div style={{ height: '100%' }} ref={containerRef} />;
}
