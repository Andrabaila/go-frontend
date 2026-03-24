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

  // Get current position on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    let isMounted = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!isMounted) return;
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        if (!isMounted) return;
        setError('⚠️ Unable to determine location.');
        setShouldShow(true);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  // Track map movement and compare with user position
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

    // ⚡️ instantly move to the last known position
    const map = mapRef.current;
    if (userLocation && map) {
      map.setView(userLocation, 16);
    }

    // ⚙️ update coordinates with a fast timeout
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
        setError('⚠️ Unable to get coordinates.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  };
  const isVisible = !userLocation || shouldShow;
  if (!isVisible) return null;

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
      </button>

      {error && (
        <div className="w-max rounded bg-red-100 px-3 py-2 text-sm text-red-700 shadow">
          {error}
        </div>
      )}
    </div>
  );
}
