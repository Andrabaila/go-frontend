import { render } from '@testing-library/react';
import { GeoJSON } from 'react-leaflet';
import ObjectLayer from './ObjectLayer';
import type { MapFeatureCollection } from '@shared/types';
import { vi, type Mock } from 'vitest';

// Mock the GeoJSON component to avoid Leaflet dependency in tests
vi.mock('react-leaflet', () => ({
  GeoJSON: vi.fn(() => <div data-testid="geojson" />),
}));

describe('ObjectLayer', () => {
  const sampleData: MapFeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: {
          type: 'restaurant',
          name: '',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [1, 1] },
        properties: {
          type: 'park',
          name: '',
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders GeoJSON with filtered features', () => {
    render(<ObjectLayer data={sampleData} filterTypes={['restaurant']} />);

    const call = (GeoJSON as unknown as Mock).mock.calls[0][0];

    expect(call.data.features).toHaveLength(1);
    expect(call.data.features[0].properties.type).toBe('restaurant');
    expect(call.style).toEqual({ color: 'blue', weight: 2 });
  });

  it('renders GeoJSON with empty features when filter does not match', () => {
    render(<ObjectLayer data={sampleData} filterTypes={['museum']} />);

    const call = (GeoJSON as unknown as Mock).mock.calls[0][0];

    expect(call.data.features).toHaveLength(0);
    expect(call.style).toEqual({ color: 'blue', weight: 2 });
  });
});
