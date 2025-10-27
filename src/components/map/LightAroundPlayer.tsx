import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L, { type LatLngTuple, Polygon } from 'leaflet';
import { PLAYER_VISIBLE_RADIUS } from '@/constants/map';

interface Props {
  position: LatLngTuple | null;
  radius?: number; // радиус светлой зоны в метрах
  opacity?: number; // непрозрачность тьмы
}

export default function LightAroundPlayer({
  position,
  radius = PLAYER_VISIBLE_RADIUS,
  opacity = 0.7,
}: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map || !position) return;

    // Удаляем старые маски
    map.eachLayer((layer) => {
      if ((layer as Polygon & { _isLightMask?: boolean })._isLightMask) {
        map.removeLayer(layer);
      }
    });

    // Полигон "вся карта"
    const bounds = map.getBounds();
    const worldPolygon: LatLngTuple[] = [
      [bounds.getSouthWest().lat - 1, bounds.getSouthWest().lng - 1],
      [bounds.getSouthWest().lat - 1, bounds.getNorthEast().lng + 1],
      [bounds.getNorthEast().lat + 1, bounds.getNorthEast().lng + 1],
      [bounds.getNorthEast().lat + 1, bounds.getSouthWest().lng - 1],
    ];

    // Создаём круг как массив точек (60 сегментов)
    const circlePoints: LatLngTuple[] = [];
    const numPoints = 60;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);

      // Переводим смещение в координаты в градусах
      const lat = position[0] + dy / 111320;
      const lng =
        position[1] + dx / (111320 * Math.cos((position[0] * Math.PI) / 180));
      circlePoints.push([lat, lng]);
    }

    // Создаём полигон с дыркой (внутри круга)
    const mask: Polygon & { _isLightMask?: boolean } = L.polygon(
      [worldPolygon, circlePoints.reverse()],
      {
        color: 'black',
        fillColor: 'black',
        fillOpacity: opacity,
        stroke: false,
      }
    );

    mask._isLightMask = true;
    mask.addTo(map);

    return () => {
      map.removeLayer(mask);
    };
  }, [map, position, radius, opacity]);

  return null;
}
