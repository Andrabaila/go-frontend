// src/components/map/MapComponent.tsx

import { useState, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import { ObjectLayer, ObjectFilterPanel } from '@/components';
import geoJsonData from '@/assets/data/osmData.json';
import type { MapFeatureCollection } from '@/types';

export default function MapComponent() {
  // Вычисляем доступные типы объектов из GeoJSON
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    (geoJsonData as MapFeatureCollection).features.forEach((f) => {
      if (f.properties.type) types.add(f.properties.type);
    });
    return Array.from(types);
  }, []);

  // Храним выбранные типы объектов для отображения
  const [filter, setFilter] = useState<string[]>(availableTypes);

  // Переключение: включить/выключить тип
  const toggleType = (type: string) => {
    setFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <ObjectFilterPanel
        availableTypes={availableTypes}
        selectedTypes={filter}
        onToggle={toggleType}
      />

      <MapContainer
        center={[52.1506, 21.0336]}
        zoom={17}
        style={{ width: '100%', height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ObjectLayer
          data={geoJsonData as MapFeatureCollection}
          filterTypes={filter}
        />
      </MapContainer>
    </div>
  );
}
