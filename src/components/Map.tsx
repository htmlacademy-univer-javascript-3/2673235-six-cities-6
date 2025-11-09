import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Offer } from '../mocks/offers';

type MapProps = {
  offers: Offer[];
};

export default function Map({ offers }: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }
    const center: [number, number] = offers.length > 0
      ? [offers[0].location.lat, offers[0].location.lng]
      : [52.374, 4.889];

    mapRef.current = L.map(containerRef.current).setView(center, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);
  }, [offers]);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) {
      return;
    }
    markersRef.current.clearLayers();

    offers.forEach((o) => {
      L.circleMarker([o.location.lat, o.location.lng],
        { radius: 8 }).addTo(markersRef.current as L.LayerGroup);
    });
  }, [offers]);

  return <div ref={containerRef} style={{ height: '100%' }} />;
}
