import { describe, it, expect, vi } from 'vitest';
import leaflet from 'leaflet';
import createMap from './createMap';

// Mock leaflet.map to avoid real DOM/Leaflet usage
vi.mock('leaflet', () => {
  return {
    default: {
      map: vi.fn(() => ({
        setView: vi.fn().mockReturnThis(),
      })),
    },
  };
});

describe('createMap', () => {
  it('creates a map and sets its view', () => {
    const container = document.createElement('div');
    const center: [number, number] = [51.505, -0.09];
    const zoom = 13;

    const map = createMap(container, center, zoom);

    expect(leaflet.map).toHaveBeenCalledWith(container);

    const mockMap = (leaflet.map as unknown as import('vitest').Mock).mock
      .results[0].value;
    expect(mockMap.setView).toHaveBeenCalledWith(center, zoom);
    expect(map).toBe(mockMap);
  });
});
