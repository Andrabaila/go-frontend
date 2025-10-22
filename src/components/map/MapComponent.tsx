// src/components/map/MapComponent.tsx
import { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';

import CoinsLayer from './CoinsLayer';
import PlayerMarker from './PlayerMarker';
import MapControls from './MapControls';
import { usePlayerPosition } from '@/hooks/usePlayerPosition';
import { ObjectLayer, OsmParksLayer } from '@/components';
import geoJsonData from '@/assets/data/osmData.json';
import type { MapFeatureCollection } from '@/types';

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
}

export default function MapComponent({ mapRef }: Props) {
  const [filter, setFilter] = useState<string[]>([]);
  const [followPlayer, setFollowPlayer] = useState(true);

  const internalMapRef = useRef<LeafletMap>(null);

  const playerPosition = usePlayerPosition(followPlayer, () => {});

  const defaultCenter: [number, number] = playerPosition || [52.1506, 21.0336];

  return (
    <div style={{ position: 'relative' }}>
      <MapControls
        filter={filter}
        setFilter={setFilter}
        followPlayer={followPlayer}
        setFollowPlayer={setFollowPlayer}
        mapRef={mapRef}
      />

      <MapContainer
        center={defaultCenter}
        zoom={17}
        style={{ width: '100%', height: '100vh' }}
        ref={(mapInstance: LeafletMap) => {
          mapRef.current = mapInstance;
          internalMapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Слой объектов */}
        <ObjectLayer
          data={geoJsonData as MapFeatureCollection}
          filterTypes={filter}
        />
        <OsmParksLayer />

        {/* Маркер игрока */}
        <PlayerMarker position={playerPosition} follow={followPlayer} />

        {/* Монеты */}
        <CoinsLayer playerPosition={playerPosition} />
      </MapContainer>
    </div>
  );
}
