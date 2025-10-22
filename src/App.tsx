// src/App.tsx

import '@/assets/styles/global.css';
import 'leaflet/dist/leaflet.css';
import { useRef } from 'react';
import { MapComponent } from '@/components';
import ButtonLocate from './components/ui/ButtonLocate';
import type { Map as LeafletMap } from 'leaflet';

function App() {
  const mapRef = useRef<LeafletMap | null>(null);

  return (
    <div className="w-full h-screen relative">
      {/* Прокидываем mapRef */}
      <MapComponent mapRef={mapRef} />
      <ButtonLocate mapRef={mapRef} />
    </div>
  );
}

export default App;
