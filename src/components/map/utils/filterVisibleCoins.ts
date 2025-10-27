import getDistanceMeters from '@/components/map/utils/getDistanceMeters';
import { PLAYER_VISIBLE_RADIUS } from '@/constants/map';
import type { MapGoin } from '@/types';

export function filterVisibleCoins(
  goins: MapGoin[],
  playerPosition: [number, number] | null,
  radius = PLAYER_VISIBLE_RADIUS
) {
  if (!playerPosition) return [];
  return goins.filter((goin) => {
    const distance = getDistanceMeters(playerPosition, [goin.lat, goin.lng]);
    return distance <= radius;
  });
}
