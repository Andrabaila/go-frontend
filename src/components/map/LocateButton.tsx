import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LocateFixed } from 'lucide-react';
import type { Map as LeafletMap } from 'leaflet';

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
}

export default function LocateButton({ mapRef }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldShow, setShouldShow] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  // Получаем текущую позицию пользователя при монтировании
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setError('⚠️ Unable to retrieve your location.')
    );
  }, []);

  // Проверяем, насколько центр карты отличается от позиции пользователя
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
      setError('❌ Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
        }
        setUserLocation([latitude, longitude]);
        setLoading(false);
      },
      () => {
        setError('⚠️ Unable to retrieve your location.');
        setLoading(false);
      }
    );
  };

  if (!shouldShow) return null;

  return createPortal(
    <div className="fixed top-40 right-4 z-[9999] flex flex-col items-end gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded shadow transition
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          text-white`}
      >
        <LocateFixed
          size={18}
          strokeWidth={2}
          className={loading ? 'animate-spin' : ''}
        />
        <span className="hidden sm:inline">
          {loading ? 'Locating...' : 'My Location'}
        </span>
      </button>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded shadow w-max">
          {error}
        </div>
      )}
    </div>,
    document.body
  );
}
