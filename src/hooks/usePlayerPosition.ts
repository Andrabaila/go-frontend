import { useState, useEffect } from 'react';

export function usePlayerPosition(
  follow: boolean,
  onPositionChange: (pos: [number, number]) => void
) {
  const [position, setPosition] = useState<[number, number] | null>(() => {
    const stored = localStorage.getItem('playerPosition');
    return stored ? (JSON.parse(stored) as [number, number]) : null;
  });

  useEffect(() => {
    if (!follow) return;
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    const handlePosition = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      const newPos: [number, number] = [latitude, longitude];
      setPosition(newPos);
      onPositionChange(newPos);
      localStorage.setItem('playerPosition', JSON.stringify(newPos));
    };

    let isMounted = true;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        if (!isMounted) return;
        handlePosition(pos);
      },
      (err) => {
        if (!isMounted) return;
        console.warn('Ошибка геопозиции (GPS):', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );

    return () => {
      isMounted = false;
      navigator.geolocation.clearWatch(watcher);
    };
  }, [follow, onPositionChange]);

  return position;
}
