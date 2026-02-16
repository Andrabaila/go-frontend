import { useState, useEffect } from 'react';
import { LocateFixed } from 'lucide-react';
import type { Map as LeafletMap } from 'leaflet';

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
}

export default function ButtonLocate({ mapRef }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldShow, setShouldShow] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  // Получаем текущее положение при монтировании
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setError('⚠️ Не удалось определить местоположение.'),
      { enableHighAccuracy: false, maximumAge: 30000, timeout: 5000 }
    );
  }, []);

  // Следим за движением карты и сравниваем с позицией пользователя
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const map = mapRef.current;

    const checkPosition = () => {
      const center = map.getCenter();
      const distance = map.distance(userLocation, [center.lat, center.lng]);
      setShouldShow(distance > 50);
    };

    map.on('moveend', checkPosition);
    checkPosition();

    return () => {
      map.off('moveend', checkPosition);
    };
  }, [mapRef, userLocation]);

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError('❌ Геолокация не поддерживается вашим браузером.');
      return;
    }

    setLoading(true);
    setError(null);

    // ⚡️ моментальное перемещение к последней известной позиции
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 16);
    }

    // ⚙️ обновляем координаты с быстрым таймаутом
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords: [number, number] = [latitude, longitude];
        setUserLocation(coords);
        if (mapRef.current) {
          mapRef.current.setView(coords, 16);
        }
        setLoading(false);
      },
      () => {
        setError('⚠️ Не удалось получить координаты.');
        setLoading(false);
      },
      {
        enableHighAccuracy: false, // быстрее, использует Wi-Fi/IP
        maximumAge: 30000, // можно брать из кеша до 30 сек
        timeout: 5000, // ограничиваем ожидание 5 сек
      }
    );
  };
  if (!shouldShow) return null;

  return (
    <div className="absolute bottom-20 right-4 z-[1000] flex flex-col items-end gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 font-bold shadow transition sm:px-3 ${loading ? 'cursor-not-allowed bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
      >
        <LocateFixed
          size={18}
          strokeWidth={2}
          className={loading ? 'animate-spin' : ''}
        />
        <span className="hidden sm:inline">
          {loading ? 'Определение...' : 'Моё местоположение'}
        </span>
      </button>

      {error && (
        <div className="w-max rounded bg-red-100 px-3 py-2 text-sm text-red-700 shadow">
          {error}
        </div>
      )}
    </div>
  );
}
