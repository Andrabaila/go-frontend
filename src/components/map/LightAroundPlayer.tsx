import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L, { type LatLngTuple, Polygon } from 'leaflet';
import { PLAYER_VISIBLE_RADIUS } from '@/constants/map';

interface Props {
  position: LatLngTuple | null;
  radius?: number;
  opacity?: number; // непрозрачность тьмы
}

export default function LightAroundPlayer({
  position,
  radius = PLAYER_VISIBLE_RADIUS,
  opacity = 0.7,
}: Props) {
  const map = useMap();
  const visitedPointsRef = useRef<LatLngTuple[]>([]);
  const maskRef = useRef<Polygon | null>(null);

  useEffect(() => {
    if (!map || !position) return;

    // добавляем новую точку если её ещё нет
    const last = visitedPointsRef.current[visitedPointsRef.current.length - 1];
    if (!last || last[0] !== position[0] || last[1] !== position[1]) {
      visitedPointsRef.current.push(position);
    }

    // удаляем старую маску
    if (maskRef.current) {
      map.removeLayer(maskRef.current);
      maskRef.current = null;
    }

    // создаём полигон на всю карту
    const bounds = map.getBounds();
    const worldPolygon: LatLngTuple[] = [
      [bounds.getSouthWest().lat - 1, bounds.getSouthWest().lng - 1],
      [bounds.getSouthWest().lat - 1, bounds.getNorthEast().lng + 1],
      [bounds.getNorthEast().lat + 1, bounds.getNorthEast().lng + 1],
      [bounds.getNorthEast().lat + 1, bounds.getSouthWest().lng - 1],
    ];

    // создаём «дырки» для всех посещённых точек
    const holes = visitedPointsRef.current.map((pos) => {
      const points: LatLngTuple[] = [];
      const numPoints = 30;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const dx = radius * Math.cos(angle);
        const dy = radius * Math.sin(angle);
        const lat = pos[0] + dy / 111320;
        const lng = pos[1] + dx / (111320 * Math.cos((pos[0] * Math.PI) / 180));
        points.push([lat, lng]);
      }
      return points; // важно для корректного «вычитания»
    });

    // создаём полигон-маску с дырками
    const mask = L.polygon([worldPolygon, ...holes], {
      color: 'black',
      fillColor: 'grey',
      fillOpacity: opacity,
      stroke: false,
    });

    mask.addTo(map);
    maskRef.current = mask;
  }, [map, position, radius, opacity]);

  return null;
}
