import { useEffect, useState } from 'react';

interface StatusData {
  distance: number; // метры
  exploredArea: number; // км²
  itemsCollected: number; // штук
  balance: number; // goins
}

export default function StatusBar() {
  const [status, setStatus] = useState<StatusData>({
    distance: 0,
    exploredArea: 0,
    itemsCollected: 0,
    balance: 0,
  });

  // Функция чтения данных из localStorage
  const loadStatus = () => {
    setStatus({
      distance: Number(localStorage.getItem('distance')) || 0,
      exploredArea: Number(localStorage.getItem('exploredArea')) || 0,
      itemsCollected: Number(localStorage.getItem('itemsCollected')) || 0,
      balance: Number(localStorage.getItem('balance')) || 0,
    });
  };

  // Обновление данных при изменении localStorage
  useEffect(() => {
    loadStatus();

    const handleStorage = (event: StorageEvent) => {
      if (
        ['distance', 'exploredArea', 'itemsCollected', 'balance'].includes(
          event.key ?? ''
        )
      ) {
        loadStatus();
      }
    };

    const interval = setInterval(loadStatus, 1000); // обновляем раз в секунду

    window.addEventListener('storage', handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-900 text-white text-sm flex justify-around items-center py-2 shadow-md z-[1000]">
      <div>
        🚶 Пройдено:{' '}
        <span className="font-semibold">{status.distance.toFixed(0)}</span> м
      </div>
      <div>
        🗺️ Исследовано:{' '}
        <span className="font-semibold">{status.exploredArea.toFixed(2)}</span>{' '}
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
