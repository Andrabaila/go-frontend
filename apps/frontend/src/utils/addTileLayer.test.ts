import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import leaflet, { Map } from 'leaflet';
import addTileLayer from './addTileLayer';

// Mock leaflet.tileLayer to prevent real network/tile loading
vi.mock('leaflet', () => {
  return {
    default: {
      tileLayer: vi.fn(() => ({
        addTo: vi.fn(),
      })),
    },
  };
});

describe('addTileLayer', () => {
  it('adds a tile layer to the provided map', () => {
    const mockMap = {} as Map;

    // Call the function
    addTileLayer(mockMap);

    // Verify that tileLayer was called with correct URL and options
    expect(leaflet.tileLayer).toHaveBeenCalledWith(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      expect.objectContaining({
        attribution: expect.stringContaining('OpenStreetMap'),
      })
    );

    const tileLayerMock = (leaflet.tileLayer as unknown as Mock).mock.results[0]
      .value;
    expect(tileLayerMock.addTo).toHaveBeenCalledWith(mockMap);
    expect(tileLayerMock.addTo).toHaveBeenCalledWith(mockMap);
  });
});
