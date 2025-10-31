// utils/distanceStorage.ts
import L from 'leaflet';

// Ключ в localStorage
const STORAGE_KEY = 'playerDistance';

// Получить текущее значение
export function getStoredDistance(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseFloat(stored) : 0;
}

// Сохранить значение
export function saveDistance(distance: number) {
  localStorage.setItem(STORAGE_KEY, distance.toString());
}

/**
 * Обновить пройденное расстояние на основе нового положения игрока.
 * @param prevPosition - предыдущая позиция игрока [lat, lng]
 * @param newPosition - новое положение игрока [lat, lng]
 * @returns новое общее расстояние (в метрах)
 */
export function updateDistance(
  prevPosition: [number, number] | null,
  newPosition: [number, number]
): number {
  if (!prevPosition) return getStoredDistance(); // если начальная позиция не определена

  // вычисляем дистанцию между двумя координатами
  const delta = L.latLng(prevPosition).distanceTo(L.latLng(newPosition)); // метры

  const currentTotal = getStoredDistance();
  const newTotal = currentTotal + delta;

  saveDistance(newTotal);
  return newTotal;
}
