import { Marker, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import type { LatLngExpression, LatLngTuple } from 'leaflet';
import L from 'leaflet';
import { PLAYER_VISIBLE_RADIUS } from '@/constants/map';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { updateExploredArea } from '@/utils';
import playerIconUrl from '@/assets/player.png';

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

const playerIcon = L.icon({
  iconUrl: playerIconUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

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
  const MIN_MOVE_METERS = 5; // игнорируем мелкие сдвиги
  const MIN_UPDATE_MS = 1000; // не чаще 1 раза в секунду

  const lastUpdateTs = useRef(0);

  useEffect(() => {
    if (!position) return;

    const current = L.latLng(position);
    const prev = prevPosition.current ? L.latLng(prevPosition.current) : null;

    if (!prev) {
      prevPosition.current = [current.lat, current.lng];
      return;
    }

    const now = Date.now();
    const deltaDistance = prev.distanceTo(current);

    // 1️⃣ игнорируем микродвижения
    if (deltaDistance < MIN_MOVE_METERS) {
      return;
    }

    // 2️⃣ throttling по времени
    if (now - lastUpdateTs.current < MIN_UPDATE_MS) {
      return;
    }

    lastUpdateTs.current = now;

    setStatus((prevStatus) => ({
      ...prevStatus,
      distance: prevStatus.distance + deltaDistance,
      exploredArea:
        prevStatus.exploredArea +
        updateExploredArea(
          [prev.lat, prev.lng],
          [current.lat, current.lng],
          PLAYER_VISIBLE_RADIUS
        ),
    }));

    prevPosition.current = [current.lat, current.lng];
  }, [position, setStatus]);

  if (!position) return null;
  return <Marker position={position} icon={playerIcon} />;
}
