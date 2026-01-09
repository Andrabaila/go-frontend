import { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { GoinsLayer, PlayerMarker, PlayerPositionControl } from '@/components';

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
  followPlayer: boolean;
}

/**
 * Основной компонент карты с интеграцией Leaflet.
 * Управляет позицией игрока и слоями для отображения монет и маркеров.
 * Использует ref для внешнего доступа к карте.
 * @param mapRef - Ref для экземпляра Leaflet Map
 * @param followPlayer - Флаг автоматического следования за игроком
 */
export default function MapComponent({ mapRef, followPlayer }: Props) {
  const [playerPosition, setPlayerPosition] = useState<[number, number] | null>(
    [52.1506, 21.0336]
  );

  const internalMapRef = useRef<LeafletMap>(null);

  const defaultCenter = playerPosition ?? [52.1506, 21.0336];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <PlayerPositionControl onChange={setPlayerPosition} />

      <MapContainer
        center={defaultCenter}
        zoom={22}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        ref={(mapInstance: LeafletMap) => {
          mapRef.current = mapInstance;
          internalMapRef.current = mapInstance;
        }}
      >
        <PlayerMarker position={playerPosition} follow={followPlayer} />
        <GoinsLayer playerPosition={playerPosition} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}
