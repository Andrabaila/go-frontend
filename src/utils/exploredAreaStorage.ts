import L, { type LatLngTuple } from 'leaflet';

const STORAGE_KEY = 'exploredArea';

/**
 * Получить сохранённую площадь исследованной области (в км²)
 */
export function getStoredArea(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseFloat(stored) : 0;
}

/**
 * Сохранить новое значение площади (в км²)
 */
export function saveArea(area: number) {
  localStorage.setItem(STORAGE_KEY, area.toString());
}

/**
 * Обновить исследованную область при перемещении игрока.
 *
 * @param prevPosition предыдущая позиция игрока [lat, lng]
 * @param newPosition новая позиция игрока [lat, lng]
 * @param radius радиус видимости игрока (в метрах)
 * @returns новое значение общей исследованной площади (в км²)
 */
export function updateExploredArea(
  prevPosition: LatLngTuple | null,
  newPosition: LatLngTuple,
  radius: number
): number {
  // если это первая позиция — просто вернуть текущую площадь
  if (!prevPosition) return getStoredArea();

  const currentArea = getStoredArea();
  const distance = L.latLng(prevPosition).distanceTo(L.latLng(newPosition));

  // добавляем площадь новой видимой зоны, если игрок сдвинулся достаточно далеко
  if (distance > radius * 0.5) {
    const areaKm2 = (Math.PI * radius * radius) / 1_000_000; // м² → км²
    const newTotal = currentArea + areaKm2;
    saveArea(newTotal);
    return newTotal;
  }

  return currentArea;
}
