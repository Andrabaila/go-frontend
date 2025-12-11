import { Marker, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import type { LatLngExpression, LatLngTuple } from 'leaflet';
import L from 'leaflet';
import { PLAYER_VISIBLE_RADIUS } from '@/constants/map';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { updateExploredArea } from '@/utils';

interface StatusData {
  distance: number; // метры
  exploredArea: number; // км²
  itemsCollected: number; // штук
  balance: number; // goins
}

interface Props {
  position: LatLngExpression | null;
  follow: boolean;
}

export default function PlayerMarker({ position, follow }: Props) {
  const map = useMap();
  const prevPosition = useRef<LatLngTuple | null>(null);

  // Используем useLocalStorage для хранения status
  const [, setStatus] = useLocalStorage<StatusData>('status', {
    distance: 0,
    exploredArea: 0,
    itemsCollected: 0,
    balance: 0,
  });

  // Следим за положением карты, если follow = true
  useEffect(() => {
    if (position && follow) {
      map.setView(position, map.getZoom());
    }
  }, [position, follow, map]);

  // Обновляем статус при изменении позиции
  useEffect(() => {
    if (position && Array.isArray(position)) {
      const prev = prevPosition.current;

      if (prev) {
        const deltaDistance = L.latLng(prev).distanceTo(L.latLng(position)); // м

        // --- обновляем статус через useLocalStorage ---
        setStatus((prevStatus) => ({
          ...prevStatus,
          distance: prevStatus.distance + deltaDistance,
          exploredArea: updateExploredArea(
            prev,
            position,
            PLAYER_VISIBLE_RADIUS
          ),
        }));
      }

      prevPosition.current = position;
    }
  }, [position, setStatus]);

  if (!position) return null;
  return <Marker position={position} />;
}
