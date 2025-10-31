// src/App.tsx

import '@/assets/styles/global.css';
import 'leaflet/dist/leaflet.css';
import { useRef, useState } from 'react';
import { MapComponent } from '@/components';
import type { Map as LeafletMap } from 'leaflet';
import BackpackButton from './components/ui/BackpackButton';
import BackpackPopup from './components/player/BackpackPopup';
import StatusBar from './components/player/StatusBar';

function App() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isBackpackOpen, setBackpackOpen] = useState(false);

  return (
    <div className="w-full h-screen relative">
      <BackpackButton onClick={() => setBackpackOpen(true)} />
      <BackpackPopup
        isOpen={isBackpackOpen}
        onClose={() => setBackpackOpen(false)}
      />
      <StatusBar />
      <MapComponent mapRef={mapRef} />
    </div>
  );
}

export default App;
