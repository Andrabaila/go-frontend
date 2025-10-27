import { useState, useEffect } from 'react';
import { usePlayerPosition } from '@/hooks/usePlayerPosition';

interface Props {
  onChange: (position: [number, number]) => void;
}

export default function PlayerPositionControl({ onChange }: Props) {
  const [useGPS, setUseGPS] = useState(true);
  const [manualPosition, setManualPosition] = useState<[number, number]>([
    52.1506, 21.0336,
  ]);

  // Получаем реальные геоданные через хук
  const gpsPosition = usePlayerPosition(useGPS, () => {});

  // Когда GPS включен, синхронизируем с внешним положением
  useEffect(() => {
    if (useGPS && gpsPosition) {
      onChange(gpsPosition);
    }
  }, [gpsPosition, useGPS]);

  // Когда ручной режим — синхронизируем manualPosition
  useEffect(() => {
    if (!useGPS) {
      onChange(manualPosition);
    }
  }, [manualPosition, useGPS]);

  const changeLatitude = (delta: number) => {
    setManualPosition(([lat, lng]) => [lat + delta, lng]);
  };

  const changeLongitude = (delta: number) => {
    setManualPosition(([lat, lng]) => [lat, lng + delta]);
  };

  return (
    <div
      style={{
        marginTop: 250,
        padding: 10,
        border: '1px solid #ccc',
        borderRadius: 6,
        width: 220,
      }}
    >
      <label style={{ display: 'block', marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={useGPS}
          onChange={(e) => setUseGPS(e.target.checked)}
        />{' '}
        Использовать GPS
      </label>

      <div style={{ marginBottom: 8 }}>
        <strong>Широта:</strong>{' '}
        {useGPS ? gpsPosition?.[0]?.toFixed(6) : manualPosition[0].toFixed(6)}
        {!useGPS && (
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <button
              style={{ backgroundColor: 'grey' }}
              onClick={() => changeLatitude(0.0001)}
            >
              ▲
            </button>
            <button
              style={{ backgroundColor: 'grey' }}
              onClick={() => changeLatitude(-0.0001)}
            >
              ▼
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Долгота:</strong>{' '}
        {useGPS ? gpsPosition?.[1]?.toFixed(6) : manualPosition[1].toFixed(6)}
        {!useGPS && (
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <button
              style={{ backgroundColor: 'grey' }}
              onClick={() => changeLongitude(0.0001)}
            >
              ►
            </button>
            <button
              style={{ backgroundColor: 'grey' }}
              onClick={() => changeLongitude(-0.0001)}
            >
              ◄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
