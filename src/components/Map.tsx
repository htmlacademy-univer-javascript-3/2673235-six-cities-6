import { memo, useEffect, useRef } from 'react';
import L, { Map as LeafletMap, LayerGroup } from 'leaflet';
import type { Offer } from '../store/types';

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

function MapComponent({ offers, activeOfferId }: MapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || offers.length === 0) {
      return;
    }

    const { lat, lng, zoom } = offers[0].location;
    const center: [number, number] = [lat, lng];

    mapRef.current = L.map(containerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);
  }, [offers]);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) {
      return;
    }

    markersRef.current.clearLayers();

    offers.forEach((offer) => {
      const icon = offer.id === activeOfferId ? activeIcon : defaultIcon;
      const position: [number, number] = [offer.location.lat, offer.location.lng];
      L.marker(position, { icon }).addTo(markersRef.current as LayerGroup);
    });
  }, [offers, activeOfferId]);

  return <div style={{ height: '100%' }} ref={containerRef} />;
}

const Map = memo(MapComponent);

export default Map;
