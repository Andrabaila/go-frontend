import { PlayerPositionControl, ButtonLocate } from '@/components';
import type { Map as LeafletMap } from 'leaflet';

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
  onPlayerPositionChange: (position: [number, number]) => void;
  isOpen: boolean;
}

export default function MapControls({
  mapRef,
  onPlayerPositionChange,
  isOpen,
}: Props) {
  if (!isOpen) return null;

  return (
    <>
      <ButtonLocate mapRef={mapRef} />
      <PlayerPositionControl onChange={onPlayerPositionChange} />
    </>
  );
}
