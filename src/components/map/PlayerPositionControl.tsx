import { useState, useEffect, useCallback } from 'react';
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

  // Делаем onChange стабильным для useEffect
  const stableOnChange = useCallback(onChange, [onChange]);

  // Когда GPS включен, синхронизируем с внешним положением
  useEffect(() => {
    if (useGPS && gpsPosition) {
      stableOnChange(gpsPosition);
    }
  }, [gpsPosition, useGPS, stableOnChange]);

  // Когда ручной режим — синхронизируем manualPosition
  useEffect(() => {
    if (!useGPS) {
      stableOnChange(manualPosition);
    }
  }, [manualPosition, useGPS, stableOnChange]);

  const changeLatitude = (delta: number) => {
    setManualPosition(([lat, lng]) => [lat + delta, lng]);
  };

  const changeLongitude = (delta: number) => {
    setManualPosition(([lat, lng]) => [lat, lng + delta]);
  };

  return (
    <div style={{ position: 'absolute', bottom: 100, left: 10, zIndex: 1001 }}>
      <div
        style={{
          marginTop: 10,
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 5,
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
    </div>
  );
}
