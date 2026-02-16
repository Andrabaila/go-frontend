import { useState } from 'react';

export function useTestPlayerPosition(initialPosition: [number, number]) {
  const [position, setPosition] = useState<[number, number]>(initialPosition);

  // Функции для изменения позиции вручную
  const moveUp = () => setPosition(([lat, lng]) => [lat + 0.0005, lng]);
  const moveDown = () => setPosition(([lat, lng]) => [lat - 0.0005, lng]);
  const moveLeft = () => setPosition(([lat, lng]) => [lat, lng - 0.0005]);
  const moveRight = () => setPosition(([lat, lng]) => [lat, lng + 0.0005]);

  return { position, setPosition, moveUp, moveDown, moveLeft, moveRight };
}
