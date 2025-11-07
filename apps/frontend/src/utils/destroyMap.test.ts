import { describe, it, expect, vi } from 'vitest';
import { Map } from 'leaflet';
import destroyMap from './destroyMap';

describe('destroyMap', () => {
  it('calls map.remove()', () => {
    // Arrange
    const fakeMap = {
      remove: vi.fn(),
    } as unknown as Map;

    // Act
    destroyMap(fakeMap);

    // Assert
    expect(fakeMap.remove).toHaveBeenCalledTimes(1);
  });
});
