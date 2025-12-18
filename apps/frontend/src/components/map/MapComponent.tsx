import { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';

import { GoinsLayer, PlayerMarker, PlayerPositionControl } from '@/components';

/* import { latLngToGlobalTile, tileToBounds } from '@/utils';
import type { TileStatus } from '@shared/types'; */

//import { useTileGridSync } from '@/hooks';

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
}

/* Цвета тайлов по статусу */
/* const TILE_COLORS: Record<TileStatus, string> = {
  discovered: 'rgba(0, 140, 255, 0.15)',
  visited: 'rgba(0, 255, 100, 0.25)',
  fully_explored: 'rgba(255, 200, 0, 0.25)',
}; */

/* ------------------------------
   Автопометка тайлов вокруг игрока

function PlayerTileUpdater({
  playerPosition,
  markTile,
}: {
  playerPosition: [number, number] | null;
  markTile: (tile: { x: number; y: number }, status: TileStatus) => void;
}) {
  useMapEvents({}); // подключение к контексту карты

  if (!playerPosition) return null;

  const [lat, lng] = playerPosition;
  const center = latLngToGlobalTile(lat, lng);

  // центральная клетка
  markTile(center, 'visited');

  // окрестность 3×3
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      markTile({ x: center.x + dx, y: center.y + dy }, 'discovered');
    }
  }

  return null;
}


   Основной компонент
--------------------------------*/
export default function MapComponent({ mapRef }: Props) {
  const [followPlayer] = useState(true);
  const [playerPosition, setPlayerPosition] = useState<[number, number] | null>(
    [52.1506, 21.0336]
  );

  const internalMapRef = useRef<LeafletMap>(null);

  /* ------------------------------
     Подключаем новый hook синхронизации

  const { tiles, markTile, fetchTilesInBBox } = useTileGridSync(
    internalMapRef.current
  );

     Загрузка тайлов по BBOX

  function BoundsWatcher() {
    let timer: number | null = null;

    useMapEvents({
      moveend() {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          if (!internalMapRef.current) return;
          const b = internalMapRef.current.getBounds();
          const sw = b.getSouthWest();
          const ne = b.getNorthEast();
          fetchTilesInBBox(sw.lat, sw.lng, ne.lat, ne.lng);
        }, 350);
      },
    });

    return null;
  }

     Отрисовка тайлов

  const renderTileRects = () =>
    Object.entries(tiles).map(([key, status]) => {
      const [x, y] = key.split('_').map(Number);
      const { sw, ne } = tileToBounds({ x, y });

      return (
        <Rectangle
          key={key}
          bounds={[
            [sw.lat, sw.lng],
            [ne.lat, ne.lng],
          ]}
          pathOptions={{
            stroke: false,
            fill: true,
            fillOpacity: 0.4,
            color: TILE_COLORS[status],
          }}
        />
      );
    });
  --------------------------------*/
  const defaultCenter = playerPosition ?? [52.1506, 21.0336];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
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
        <PlayerMarker position={playerPosition} follow={followPlayer} />
        <GoinsLayer playerPosition={playerPosition} />
        {/*         {renderTileRects()} */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}
