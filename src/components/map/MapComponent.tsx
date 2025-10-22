// src/components/map/MapComponent.tsx

import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';

import {
  ObjectLayer,
  ObjectFilterPanel,
  FollowPlayerButton,
  OsmParksLayer,
} from '@/components';
import geoJsonData from '@/assets/data/osmData.json';
import type { MapFeatureCollection } from '@/types';
import CoinsLayer from './CoinsLayer';

// --- Компонент, который следит за позицией игрока и при включении "следить" центрирует карту ---
function PlayerMarker({
  follow,
  onPositionChange,
}: {
  follow: boolean;
  onPositionChange: (pos: [number, number]) => void;
}) {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        onPositionChange(newPos);

        if (follow) map.setView(newPos, map.getZoom());
      },
      (err) => console.warn('Ошибка геопозиции:', err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [follow, map, onPositionChange]);

  if (!position) return null;
  return <Marker position={position} />;
}

// --- Основной компонент карты ---
interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
}

export default function MapComponent({ mapRef }: Props) {
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    (geoJsonData as MapFeatureCollection).features.forEach((f) => {
      if (f.properties.type) types.add(f.properties.type);
    });
    return Array.from(types);
  }, []);

  const [filter, setFilter] = useState<string[]>(availableTypes);
  const [followPlayer, setFollowPlayer] = useState(true); // режим "следить"
  const [playerPosition, setPlayerPosition] = useState<[number, number] | null>(
    null
  );

  const toggleType = (type: string) => {
    setFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const internalMapRef = useRef<LeafletMap>(null);

  return (
    <div style={{ position: 'relative' }}>
      <ObjectFilterPanel
        availableTypes={availableTypes}
        selectedTypes={filter}
        onToggle={toggleType}
      />

      <FollowPlayerButton
        follow={followPlayer}
        onToggle={() => setFollowPlayer((prev) => !prev)}
      />

      <MapContainer
        center={[52.1506, 21.0336]}
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

        {/* Маркер игрока + режим слежения */}
        <PlayerMarker
          follow={followPlayer}
          onPositionChange={setPlayerPosition}
        />
        <CoinsLayer playerPosition={playerPosition} />
      </MapContainer>
    </div>
  );
}
