import { useEffect, useState } from 'react';
import {
  generateCoins,
  type MapGoin,
} from '@/components/map/utils/generateGoins';
import { BASE_COORDS, COINS_COUNT } from '@/constants/map';

export function useCoins() {
  const [coins, setCoins] = useState<MapGoin[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('goinsData');
    if (stored) {
      setCoins(JSON.parse(stored));
    } else {
      const newCoins = generateCoins(BASE_COORDS, COINS_COUNT);
      setCoins(newCoins);
      localStorage.setItem('goinsData', JSON.stringify(newCoins));
    }
  }, []);

  const removeCoin = (id: string) => {
    const updated = coins.filter((c) => c.id !== id);
    setCoins(updated);
    localStorage.setItem('goinsData', JSON.stringify(updated));
  };

  return { coins, setCoins, removeCoin };
}
