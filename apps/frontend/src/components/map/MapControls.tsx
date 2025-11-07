import { useMemo } from 'react';
import { ObjectFilterPanel, ButtonFollowPlayer } from '@/components';
import ButtonLocate from '@/components/ui/ButtonLocate';
import type { MapFeatureCollection } from '@shared/types';
import geoJsonData from '@/assets/data/osmData.json';
import type { Map as LeafletMap } from 'leaflet';

interface Props {
  filter: string[];
  setFilter: React.Dispatch<React.SetStateAction<string[]>>;
  followPlayer: boolean;
  setFollowPlayer: React.Dispatch<React.SetStateAction<boolean>>;
  mapRef: React.RefObject<LeafletMap | null>;
}

export default function MapControls({
  filter,
  setFilter,
  followPlayer,
  setFollowPlayer,
  mapRef,
}: Props) {
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    (geoJsonData as MapFeatureCollection).features.forEach((f) => {
      if (f.properties.type) types.add(f.properties.type);
    });
    return Array.from(types);
  }, []);

  const toggleType = (type: string) => {
    setFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <>
      <ObjectFilterPanel
        availableTypes={availableTypes}
        selectedTypes={filter}
        onToggle={toggleType}
      />
      <ButtonFollowPlayer
        follow={followPlayer}
        onToggle={() => setFollowPlayer((prev) => !prev)}
      />
      <ButtonLocate mapRef={mapRef} />
    </>
  );
}
