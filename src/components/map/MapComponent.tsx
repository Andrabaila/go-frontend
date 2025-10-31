import { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';

import CoinsLayer from './GoinsLayer';
import PlayerMarker from './PlayerMarker';
import MapControls from './MapControls';

import LightAroundPlayer from './LightAroundPlayer';
import PlayerPositionControl from '../ui/PlayerPositionControl';

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
}

export default function MapComponent({ mapRef }: Props) {
  const [filter, setFilter] = useState<string[]>([]);
  const [followPlayer, setFollowPlayer] = useState(true);
  const [playerPosition, setPlayerPosition] = useState<[number, number] | null>(
    [52.1506, 21.0336]
  );

  const internalMapRef = useRef<LeafletMap>(null);

  const defaultCenter: [number, number] = playerPosition || [52.1506, 21.0336];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Панель управления фильтрами и следованием */}
      <MapControls
        filter={filter}
        setFilter={setFilter}
        followPlayer={followPlayer}
        setFollowPlayer={setFollowPlayer}
        mapRef={mapRef}
      />

      {/* Панель ручного управления игроком */}
      <div
        style={{ position: 'absolute', bottom: 100, left: 10, zIndex: 3000 }}
      >
        <PlayerPositionControl onChange={setPlayerPosition} />
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={17}
        style={{ width: '100%', height: '100%' }}
        ref={(mapInstance: LeafletMap) => {
          mapRef.current = mapInstance;
          internalMapRef.current = mapInstance;
        }}
      >
        {/* Слои объектов */}

        {/* Маркер игрока */}
        <PlayerMarker position={playerPosition} follow={followPlayer} />

        <LightAroundPlayer position={playerPosition} />

        {/* Монеты */}
        <CoinsLayer playerPosition={playerPosition} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}
