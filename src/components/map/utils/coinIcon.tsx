import { CircleDollarSign } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';

const coinSvg = renderToStaticMarkup(
  <CircleDollarSign size={28} color="#f5c518" />
);

export const coinIcon = divIcon({
  html: coinSvg,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});
