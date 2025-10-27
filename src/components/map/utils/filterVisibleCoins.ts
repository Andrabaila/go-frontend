import { LatLng } from 'leaflet';
import type { Coin } from './generateGoins';
import {
  BASE_COORDS,
  MAX_DISTANCE_FROM_BASE,
  PLAYER_VISIBLE_RADIUS,
} from '@/constants/map';

export function filterVisibleCoins(
  coins: Coin[],
  playerPosition: [number, number] | null
): Coin[] {
  if (!playerPosition) return [];

  const playerLatLng = new LatLng(playerPosition[0], playerPosition[1]);
  const baseLatLng = new LatLng(BASE_COORDS[0], BASE_COORDS[1]);

  return coins.filter((coin) => {
    const coinLatLng = new LatLng(coin.lat, coin.lng);

    const distFromPlayer = playerLatLng.distanceTo(coinLatLng);
    const distFromBase = baseLatLng.distanceTo(coinLatLng);

    return (
      distFromBase <= MAX_DISTANCE_FROM_BASE &&
      distFromPlayer <= PLAYER_VISIBLE_RADIUS
    );
  });
}
