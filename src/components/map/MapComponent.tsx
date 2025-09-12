// src/components/map/MapComponent.tsx
import { useEffect, useRef } from 'react';
import leaflet from 'leaflet';

function MapComponent() {
  // useRef для хранения ссылки на DOM-элемент карты
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Инициализация карты только после монтирования компонента
    if (mapRef.current) {
      // Создаем экземпляр карты, центруем его на условных координатах
      const map = leaflet.map(mapRef.current).setView([52.15, 21.026], 25);

      // Добавляем слой с плитками (тайлами) OpenStreetMap
      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
        .addTo(map);

      // Функция очистки - уничтожает карту при размонтировании компонента
      return () => {
        map.remove();
      };
    }
  }, []); // Эффект запускается только once при монтировании

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}

export default MapComponent;