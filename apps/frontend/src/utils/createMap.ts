import leaflet, { Map } from 'leaflet';

export default function createMap(
  container: HTMLDivElement,
  center: [number, number],
  zoom: number
): Map {
  return leaflet.map(container).setView(center, zoom);
}
