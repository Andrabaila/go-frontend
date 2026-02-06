import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';

const questActiveSvg = renderToStaticMarkup(
  <MapPin size={28} color="#2563eb" />
);
const questVisitedSvg = renderToStaticMarkup(
  <MapPin size={28} color="#16a34a" />
);
const questInactiveSvg = renderToStaticMarkup(
  <MapPin size={28} color="#9ca3af" />
);

export const questActiveIcon = divIcon({
  html: questActiveSvg,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

export const questVisitedIcon = divIcon({
  html: questVisitedSvg,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

export const questInactiveIcon = divIcon({
  html: questInactiveSvg,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});
