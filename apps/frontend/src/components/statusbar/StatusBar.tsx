import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StatusData {
  distance: number; // метры
  exploredArea: number; // км²
  itemsCollected: number; // штук
  balance: number; // goins
}

export default function StatusBar() {
  const [status] = useLocalStorage<StatusData>('status', {
    distance: 0,
    exploredArea: 0,
    itemsCollected: 0,
    balance: 0,
  });

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-900 text-white text-sm flex justify-around items-center py-2 shadow-md z-[1000]">
      <div>
        🚶 Пройдено:{' '}
        <span className="font-semibold">
          {(status.distance / 1000).toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}{' '}
          км
        </span>
      </div>

      <div>
        🗺️ Исследовано:{' '}
        <span className="font-semibold">
          {status.exploredArea.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </span>{' '}
        км²
      </div>

      <div>
        🎒 Предметы:{' '}
        <span className="font-semibold">{status.itemsCollected}</span>
      </div>

      <div>
        💰 Goins: <span className="font-semibold">{status.balance}</span>
      </div>
    </div>
  );
}
