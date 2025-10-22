// src/components/map/CoinsLayer.tsx

import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { divIcon, LatLng } from 'leaflet';
import { CircleDollarSign } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import PopupGodsend from '@/components/ui/PopupGodsend'; // ✅ импорт нового компонента

const BASE_COORDS: [number, number] = [52.1506, 21.0336];
const MAX_DISTANCE_FROM_BASE = 1050;
const PLAYER_VISIBLE_RADIUS = 20000;
const COINS_COUNT = 100;

const coinSvg = renderToStaticMarkup(
  <CircleDollarSign size={28} color="#f5c518" />
);

const coinIcon = divIcon({
  html: coinSvg,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

interface Coin {
  id: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
}

interface Props {
  playerPosition: [number, number] | null;
}

function generateCoins(center: [number, number], count: number): Coin[] {
  const coins: Coin[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random() * 1000;
    const angle = Math.random() * 2 * Math.PI;
    const dx = (r / 111320) * Math.cos(angle);
    const dy = (r / 111320) * Math.sin(angle);
    coins.push({
      id: `coin-${i}`,
      lat: center[0] + dy,
      lng: center[1] + dx,
      description: `Старинная монета #${i + 1}`,
      image: '/icons/coin_popup.png',
    });
  }
  return coins;
}

export default function CoinsLayer({ playerPosition }: Props) {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('coinsData');
    if (stored) {
      setCoins(JSON.parse(stored));
    } else {
      const newCoins = generateCoins(BASE_COORDS, COINS_COUNT);
      setCoins(newCoins);
      localStorage.setItem('coinsData', JSON.stringify(newCoins));
    }
  }, []);

  const handleTakeCoin = (id: string) => {
    const updated = coins.filter((c) => c.id !== id);
    setCoins(updated);
    localStorage.setItem('coinsData', JSON.stringify(updated));
  };

  const visibleCoins = coins.filter((coin) => {
    if (!playerPosition) return false;
    const playerLatLng = new LatLng(playerPosition[0], playerPosition[1]);
    const coinLatLng = new LatLng(coin.lat, coin.lng);
    const baseLatLng = new LatLng(BASE_COORDS[0], BASE_COORDS[1]);

    const distFromPlayer = playerLatLng.distanceTo(coinLatLng);
    const distFromBase = baseLatLng.distanceTo(coinLatLng);

    return (
      distFromBase <= MAX_DISTANCE_FROM_BASE &&
      distFromPlayer <= PLAYER_VISIBLE_RADIUS
    );
  });

  return (
    <>
      {visibleCoins.map((coin) => (
        <Marker key={coin.id} position={[coin.lat, coin.lng]} icon={coinIcon}>
          <Popup>
            <PopupGodsend
              id={coin.id}
              description={coin.description}
              image={coin.image}
              onTake={handleTakeCoin}
            />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
