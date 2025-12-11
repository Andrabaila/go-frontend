// hooks/useTileGridSync.ts
import { useEffect, useRef, useState } from 'react';
import { latLngToGlobalTile } from '../utils/geoTilesGlobal';
import type { TileCoord } from '../utils/geoTilesGlobal';
import type { TileStatus } from '@shared/types';

const STORAGE_KEY = 'tileGrid_v2';
const API = 'https://localhost:3000/tiles'; // NestJS + globalPrefix

function tileKey(tile: TileCoord) {
  return `${tile.x}_${tile.y}`;
}

export function useTileGridSync(map: L.Map | null) {
  const [tiles, setTiles] = useState<Record<string, TileStatus>>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  // pending changes that need syncing
  const pendingRef = useRef<Record<string, TileStatus>>({});

  function saveLocal(next: Record<string, TileStatus>) {
    setTiles(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* игнорируем переполнение хранилища */
    }
  }

  /* -----------------------------------
     Пометка клетки (с рангами статусов)
  -------------------------------------*/
  function markTile(tile: TileCoord, status: TileStatus) {
    const key = tileKey(tile);
    const current = tiles[key];

    const rank = {
      discovered: 1,
      visited: 2,
      fully_explored: 3,
    } as const;

    if (!current || rank[status] > rank[current]) {
      const updated = { ...tiles, [key]: status };
      saveLocal(updated);
      pendingRef.current[key] = status;
    }
  }

  /* -----------------------------------
     Реакция на перемещение карты
     (центр карты → visited, соседи → discovered)
  -------------------------------------*/
  useEffect(() => {
    if (!map) return;

    const handler = () => {
      const c = map.getCenter();
      const tile = latLngToGlobalTile(c.lat, c.lng);

      // центральный tile = visited
      markTile(tile, 'visited');

      // соседи = discovered
      const neighbors = [
        { x: tile.x - 1, y: tile.y },
        { x: tile.x + 1, y: tile.y },
        { x: tile.x, y: tile.y - 1 },
        { x: tile.x, y: tile.y + 1 },
      ];
      neighbors.forEach((n) => markTile(n, 'discovered'));
    };

    // подписка
    map.on('moveend', handler);

    // инициируем сразу при загрузке
    handler();

    return () => {
      map.off('moveend', handler);
    };
  }, [map, tiles]);

  /* -----------------------------------
     Пакетная синхронизация каждые 5 сек
  -------------------------------------*/
  useEffect(() => {
    const timer = setInterval(async () => {
      const pending = { ...pendingRef.current };
      const keys = Object.keys(pending);

      if (keys.length === 0) return;

      try {
        await fetch(API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': '1',
          },
          body: JSON.stringify({
            tiles: keys.map((k) => {
              const [xStr, yStr] = k.split('_');
              return {
                x: Number(xStr),
                y: Number(yStr),
                status: pending[k],
              };
            }),
          }),
        });

        // очистить pending после успешной синхронизации
        pendingRef.current = {};
      } catch (err) {
        console.warn('Sync failed, will retry later:', err);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* -----------------------------------
     Ручная загрузка тайлов в BBOX
  -------------------------------------*/
  async function fetchTilesInBBox(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number
  ) {
    try {
      const url = `${API}?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`;
      console.log('FETCH BBOX →', url);
      const res = await fetch(url, {
        headers: { 'x-user-id': '1' },
      });

      if (!res.ok) {
        console.warn('BBox load failed:', await res.text());
        return;
      }

      const data = await res.json();

      const updated = { ...tiles };
      data.tiles.forEach((t: { x: number; y: number; status: TileStatus }) => {
        updated[`${t.x}_${t.y}`] = t.status;
      });

      saveLocal(updated);
    } catch (err) {
      console.warn('fetchTilesInBBox failed:', err);
    }
  }

  /* -----------------------------------
     Принудительная синхронизация (кнопка)
  -------------------------------------*/
  async function manualSyncNow() {
    const pending = { ...pendingRef.current };
    if (Object.keys(pending).length === 0) return;

    try {
      await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '1',
        },
        body: JSON.stringify({
          tiles: Object.entries(pending).map(([key, status]) => {
            const [xStr, yStr] = key.split('_');
            return { x: Number(xStr), y: Number(yStr), status };
          }),
        }),
      });

      pendingRef.current = {};
    } catch (e) {
      console.error('Manual sync failed:', e);
    }
  }

  /* -----------------------------------
     Возвращаем API хука
  -------------------------------------*/
  return {
    tiles,
    markTile,
    fetchTilesInBBox,
    manualSyncNow,
  };
}
