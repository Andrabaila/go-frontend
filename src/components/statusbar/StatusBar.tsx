import { useLocalStorage } from '@/hooks';

interface StatusData {
  distance: number; // метры
  exploredArea: number; // км²
  itemsCollected: number; // штук
  balance: number; // goins
}

/**
 * Статус-бар с показателями прогресса игрока.
 * Данные хранятся в localStorage для персистентности.
 */
export default function StatusBar() {
  const [status] = useLocalStorage<StatusData>('status', {
    distance: 0,
    exploredArea: 0,
    itemsCollected: 0,
    balance: 0,
  });

  return (
    <div className="flex w-full items-center justify-around bg-gray-900/80 py-2 text-sm text-white shadow-md">
      <div>
        👣{' '}
        <span className="font-semibold">
          {(status.distance / 1000).toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
        </span>
      </div>

      <div>
        🗺️{' '}
        <span className="font-semibold">
          {status.exploredArea.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </span>{' '}
        км²
      </div>

      <div>
        🎒 <span className="font-semibold">{status.itemsCollected}</span>
      </div>

      <div>
        💰 <span className="font-semibold">{status.balance}</span>
      </div>
    </div>
  );
}
