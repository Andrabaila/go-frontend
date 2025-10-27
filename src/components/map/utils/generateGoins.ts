// src/components/map/utils/generateCoins.ts

import { MAX_DISTANCE_FROM_BASE } from '@/constants/map';
import type { MapGoin } from '@/types';

/**
 * Генерация массива случайных "монет" в пределах радиуса ~1 км.
 * @param center - центральные координаты [lat, lng]
 * @param count - количество монет
 */
export function generateCoins(
  center: [number, number],
  count: number
): MapGoin[] {
  const coins: MapGoin[] = [];

  for (let i = 0; i < count; i++) {
    const r = Math.random() * MAX_DISTANCE_FROM_BASE;
    const angle = Math.random() * 2 * Math.PI;

    const dx = (r / 111320) * Math.cos(angle);
    const dy = (r / 111320) * Math.sin(angle);

    coins.push({
      type: 'goin',
      id: `goin-${i}`,
      lat: center[0] + dy,
      lng: center[1] + dx,
      name: `Goin`,
      image: '/icons/coin_popup.png',
      weight: 1,
      value: 1,
    });
  }

  return coins;
}
