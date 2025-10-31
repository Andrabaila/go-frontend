import { Marker, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import type { LatLngExpression, LatLngTuple } from 'leaflet';
import L from 'leaflet';
import { updateExploredArea } from '@/utils/exploredAreaStorage';
import { PLAYER_VISIBLE_RADIUS } from '@/constants/map';

interface Props {
  position: LatLngExpression | null;
  follow: boolean;
}

export default function PlayerMarker({ position, follow }: Props) {
  const map = useMap();
  const prevPosition = useRef<LatLngTuple | null>(null);

  useEffect(() => {
    if (position && follow) {
      map.setView(position, map.getZoom());
    }
  }, [position, follow, map]);

  useEffect(() => {
    if (position && Array.isArray(position)) {
      const prev = prevPosition.current;
      if (prev) {
        // --- обновление пройденного расстояния ---
        const delta = L.latLng(prev).distanceTo(L.latLng(position));
        const storedDistance = Number(localStorage.getItem('distance')) || 0;
        localStorage.setItem('distance', (storedDistance + delta).toString());

        // --- обновление исследованной области ---
        updateExploredArea(prev, position, PLAYER_VISIBLE_RADIUS);
      }
      prevPosition.current = position;
    }
  }, [position]);

  if (!position) return null;
  return <Marker position={position} />;
}
