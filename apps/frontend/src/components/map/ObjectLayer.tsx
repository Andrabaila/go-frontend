import { GeoJSON } from 'react-leaflet';
import type { MapFeatureCollection } from '@shared/types';

interface Props {
  data: MapFeatureCollection;
  filterTypes: string[];
}

export default function ObjectLayer({ data, filterTypes }: Props) {
  const filteredFeatures: MapFeatureCollection = {
    type: 'FeatureCollection',
    features: data.features.filter((f) =>
      filterTypes.includes(f.properties.type)
    ),
  };

  return (
    <GeoJSON
      key={filterTypes.join(',')}
      data={filteredFeatures}
      style={{ color: 'blue', weight: 2 }}
    />
  );
}
