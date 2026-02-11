import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';

const wrap = (svg: string, className: string) =>
  `<div class="${className}">${svg}</div>`;

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
  html: wrap(questActiveSvg, 'quest-pin quest-pin--active'),
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

export const questVisitedIcon = divIcon({
  html: wrap(questVisitedSvg, 'quest-pin quest-pin--visited'),
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

export const questInactiveIcon = divIcon({
  html: wrap(questInactiveSvg, 'quest-pin quest-pin--inactive'),
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});
