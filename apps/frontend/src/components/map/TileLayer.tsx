// components/TileLayer.tsx
import React, { useEffect } from 'react';
import L from 'leaflet';
import { tileToBounds } from '../../utils/geoTilesGlobal';
import type { TileCoord } from '../../utils/geoTilesGlobal';

type Props = {
  map: L.Map | null;
  tiles: Record<string, 'discovered' | 'visited' | 'fully_explored'>;
};

function colorByStatus(status: string) {
  switch (status) {
    case 'discovered':
      return '#cccccc';
    case 'visited':
      return '#ffd166'; // yellow-ish
    case 'fully_explored':
      return '#06d6a0'; // green-ish
    default:
      return '#000000';
  }
}

export const TileLayer: React.FC<Props> = ({ map, tiles }) => {
  useEffect(() => {
    if (!map) return;
    const layer = L.layerGroup().addTo(map);

    Object.entries(tiles).forEach(([key, status]) => {
      const [xStr, yStr] = key.split('_');
      const tile: TileCoord = { x: Number(xStr), y: Number(yStr) };
      const bounds = tileToBounds(tile);
      L.rectangle(
        [
          [bounds.sw.lat, bounds.sw.lng],
          [bounds.ne.lat, bounds.ne.lng],
        ],
        {
          weight: 1,
          color: colorByStatus(status),
          fillOpacity: 0.25,
        }
      ).addTo(layer);
    });

    return () => {
      map.removeLayer(layer);
    };
  }, [map, tiles]);

  return null;
};
