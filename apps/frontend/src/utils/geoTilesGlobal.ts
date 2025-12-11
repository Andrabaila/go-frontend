// utils/geoTilesGlobal.ts
import L from 'leaflet';

export type TileCoord = { x: number; y: number };
export type TileBounds = { sw: L.LatLng; ne: L.LatLng };

export const TILE_SIZE_M = 100; // можно менять

// WebMercator constants
const R_MAJOR = 6378137.0;
const ORIGIN_SHIFT = (2 * Math.PI * R_MAJOR) / 2.0; // 20037508.342789244

/**
 * LatLng -> meters (EPSG:3857)
 */
export function latLngToMeters(lat: number, lng: number) {
  const mx = (lng * ORIGIN_SHIFT) / 180.0;
  let my =
    Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
  my = (my * ORIGIN_SHIFT) / 180.0;
  return { mx, my };
}

/**
 * meters -> LatLng
 */
export function metersToLatLng(mx: number, my: number) {
  const lng = (mx / ORIGIN_SHIFT) * 180.0;
  let lat = (my / ORIGIN_SHIFT) * 180.0;
  lat =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((lat * Math.PI) / 180.0)) - Math.PI / 2.0);
  return { lat, lng };
}

/**
 * Получаем tile по lat/lng — глобальная сетка (EPSG:3857)
 */
export function latLngToGlobalTile(lat: number, lng: number): TileCoord {
  const { mx, my } = latLngToMeters(lat, lng);
  const tileX = Math.floor((mx + ORIGIN_SHIFT) / TILE_SIZE_M);
  const tileY = Math.floor((my + ORIGIN_SHIFT) / TILE_SIZE_M);
  return { x: tileX, y: tileY };
}

/**
 * Границы tile (в LatLng)
 */
export function tileToBounds(tile: TileCoord): TileBounds {
  const minx = tile.x * TILE_SIZE_M - ORIGIN_SHIFT;
  const miny = tile.y * TILE_SIZE_M - ORIGIN_SHIFT;
  const maxx = (tile.x + 1) * TILE_SIZE_M - ORIGIN_SHIFT;
  const maxy = (tile.y + 1) * TILE_SIZE_M - ORIGIN_SHIFT;

  const sw = metersToLatLng(minx, miny);
  const ne = metersToLatLng(maxx, maxy);
  return {
    sw: L.latLng(sw.lat, sw.lng),
    ne: L.latLng(ne.lat, ne.lng),
  };
}

/**
 * Генерация списка tile координат, пересекающих bbox (lat/lng)
 */
export function tilesInBBox(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number
): TileCoord[] {
  const sw = latLngToGlobalTile(minLat, minLng);
  const ne = latLngToGlobalTile(maxLat, maxLng);

  const tiles: TileCoord[] = [];
  const minX = Math.min(sw.x, ne.x);
  const maxX = Math.max(sw.x, ne.x);
  const minY = Math.min(sw.y, ne.y);
  const maxY = Math.max(sw.y, ne.y);

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      tiles.push({ x, y });
    }
  }
  return tiles;
}
