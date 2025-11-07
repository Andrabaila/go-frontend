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
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        onPositionChange(newPos);
        localStorage.setItem('playerPosition', JSON.stringify(newPos));
      },
      (err) => {
        console.warn('Ошибка геопозиции:', err);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [follow, onPositionChange]);

  return position;
}
