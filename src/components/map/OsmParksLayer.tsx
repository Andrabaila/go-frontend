// src/components/OsmParksLayer.tsx
import { useEffect, useState } from 'react';
import { Marker, useMap, Popup } from 'react-leaflet';
import L, { LatLngBounds } from 'leaflet';
import { ParkPopup } from '@/components';

interface OverpassNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: { name?: string; [k: string]: string | undefined };
}

interface OverpassWay {
  type: 'way';
  id: number;
  nodes?: number[];
  geometry?: { lat: number; lon: number }[]; // when out geom / out body returns geometry
  tags?: { name?: string; [k: string]: string | undefined };
}

type OverpassElement = OverpassNode | OverpassWay;

interface OverpassResponse {
  elements: OverpassElement[];
}

interface Park {
  id: number;
  name: string;
  lat: number;
  lon: number;
  isArea: boolean;
}

const PRIMARY_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const FALLBACK_ENDPOINT = 'https://overpass.kumi.systems/api/interpreter'; // alternative mirror

export default function OsmParksLayer() {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const map = useMap();

  useEffect(() => {
    let mounted = true;
    let debounceTimeout: number | null = null;

    const buildQuery = (
      south: number,
      west: number,
      north: number,
      east: number
    ) => {
      // Query both nodes (simple points) and ways (areas) with geometry
      return `
        [out:json][timeout:25];
        (
          node["leisure"="park"](${south},${west},${north},${east});
          way["leisure"="park"](${south},${west},${north},${east});
        );
        out body geom;
      `;
    };

    const parseResponse = (data: OverpassResponse): Park[] => {
      const parsed: Park[] = [];

      for (const el of data.elements) {
        if (
          el.type === 'node' &&
          typeof el.lat === 'number' &&
          typeof el.lon === 'number'
        ) {
          parsed.push({
            id: el.id,
            name: el.tags?.name ?? 'Unnamed park',
            lat: el.lat,
            lon: el.lon,
            isArea: false,
          });
        } else if (
          el.type === 'way' &&
          Array.isArray(el.geometry) &&
          el.geometry.length > 0
        ) {
          // use centroid of geometry as marker position
          const coords = el.geometry;
          let sumLat = 0;
          let sumLon = 0;
          for (const p of coords) {
            sumLat += p.lat;
            sumLon += p.lon;
          }
          const lat = sumLat / coords.length;
          const lon = sumLon / coords.length;
          parsed.push({
            id: el.id,
            name: el.tags?.name ?? 'Unnamed park',
            lat,
            lon,
            isArea: true,
          });
        }
      }
      return parsed;
    };

    const fetchParksForBounds = async (endpoint: string) => {
      try {
        const bounds: LatLngBounds = map.getBounds();
        const south = bounds.getSouth();
        const west = bounds.getWest();
        const north = bounds.getNorth();
        const east = bounds.getEast();

        console.debug('[OsmParksLayer] fetchParksForBounds — bounds:', {
          south,
          west,
          north,
          east,
        });
        const query = buildQuery(south, west, north, east);
        console.debug('[OsmParksLayer] Query:\n', query);

        setLoading(true);
        const resp = await fetch(endpoint, { method: 'POST', body: query });
        const text = await resp.text();
        console.debug(
          `[OsmParksLayer] HTTP ${resp.status} response text (truncated 1000 chars):\n`,
          text.slice(0, 1000)
        );

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        // parse JSON (Overpass returns JSON)
        const data: OverpassResponse = JSON.parse(text);
        const parsed = parseResponse(data);
        console.debug('[OsmParksLayer] parsed parks count:', parsed.length);

        if (mounted) {
          setParks(parsed);
        }
        setLoading(false);
        return true;
      } catch (err) {
        console.error('[OsmParksLayer] fetch error:', err);
        setLoading(false);
        return false;
      }
    };

    const doFetch = async () => {
      // wait until map is ready and has bounds
      await new Promise<void>((resolve) => map.whenReady(() => resolve()));
      // small guard: if bounds are invalid, don't fetch
      const b = map.getBounds();
      if (!b || !isFinite(b.getNorth())) {
        console.warn('[OsmParksLayer] map bounds not ready, skipping fetch');
        return;
      }

      // first try primary endpoint
      const ok = await fetchParksForBounds(PRIMARY_ENDPOINT);
      if (!ok) {
        // try fallback
        console.warn(
          '[OsmParksLayer] primary Overpass failed, trying fallback endpoint'
        );
        await fetchParksForBounds(FALLBACK_ENDPOINT);
      }
    };

    // initial fetch when map is ready
    doFetch().catch((e) => console.error(e));

    // fetch on moveend with debounce
    const onMoveEnd = () => {
      if (debounceTimeout) window.clearTimeout(debounceTimeout);
      debounceTimeout = window.setTimeout(() => {
        doFetch().catch((e) => console.error(e));
      }, 700);
    };

    map.on('moveend', onMoveEnd);

    return () => {
      mounted = false;
      map.off('moveend', onMoveEnd);
      if (debounceTimeout) window.clearTimeout(debounceTimeout);
    };
  }, [map]);

  const parkIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    left: 10,
    top: 100,
    zIndex: 9999,
    background: 'grey',
    padding: '6px 8px',
    borderRadius: 6,
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
    fontSize: 13,
  };

  return (
    <>
      <div style={overlayStyle}>
        {loading ? 'Loading parks…' : `Parks: ${parks.length}`}
      </div>

      {parks.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lon]} icon={parkIcon}>
          <Popup>
            <ParkPopup park={p} />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
