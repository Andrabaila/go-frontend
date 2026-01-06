import { useEffect, useState } from 'react';
import { generateGoins } from '@/components/map/utils/generateGoins';
import { BASE_COORDS, COINS_COUNT } from '@/constants/map';
import type { MapGoin } from '@shared/types';

export function useCoins() {
  const [coins, setCoins] = useState<MapGoin[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('goinsData');
    if (stored) {
      setCoins(JSON.parse(stored));
    } else {
      const newCoins = generateGoins(BASE_COORDS, COINS_COUNT);
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
