import '@/assets/styles/global.css';
import 'leaflet/dist/leaflet.css';
import { useRef, useState } from 'react';
import { MapComponent } from '@/components';
import type { Map as LeafletMap } from 'leaflet';
import BackpackButton from './components/ui/BackpackButton';
import BackpackPopup from './components/player/BackpackPopup';
import StatusBar from './components/player/StatusBar';
import { LoginRegisterModal } from './components/player/LoginRegisterModal';
import LoginRegisterButton from './components/ui/LoginRegisterButton';

function App() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isBackpackOpen, setBackpackOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  return (
    <div className="w-full h-screen relative">
      <BackpackButton onClick={() => setBackpackOpen(true)} />
      <BackpackPopup
        isOpen={isBackpackOpen}
        onClose={() => setBackpackOpen(false)}
      />
      <StatusBar />
      <LoginRegisterButton
        onClick={() => setModalOpen(true)}
        userEmail={userEmail}
      />
      <LoginRegisterModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={(email) => {
          setUserEmail(email); // ← сохраняем email
          setModalOpen(false); // ← закрываем модалку
        }}
      />
      <MapComponent mapRef={mapRef} />
    </div>
  );
}

export default App;
