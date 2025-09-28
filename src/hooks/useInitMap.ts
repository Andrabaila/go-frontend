import { useEffect } from 'react';
import createMap from '../utils/createMap';
import addTileLayer from '../utils/addTileLayer';
import destroyMap from '../utils/destroyMap';
import createFogOfWarLayer from '../components/map/FogOfWarCanvas';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../constants/mapConfig';

function useInitMap(mapRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!mapRef.current) return;

    const map = createMap(mapRef.current, DEFAULT_CENTER, DEFAULT_ZOOM);
    addTileLayer(map);

    // Добавляем туман
    const fog = createFogOfWarLayer(map);

    return () => {
      map.removeLayer(fog);
      destroyMap(map);
    };
  }, [mapRef]);
}

export default useInitMap;
