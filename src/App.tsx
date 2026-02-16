import '@/assets/styles/global.css';
import 'leaflet/dist/leaflet.css';
import { useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import {
  MapComponent,
  TopUI,
  BackpackBottomSheet,
  LoginRegisterModal,
  LoginRegisterButton,
  MapControls,
  MainMenu,
  QuestsList,
} from '@/components';
type MainMenuItem = 'map' | 'quests' | 'inventory' | 'profile' | null;

function App() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [filter, setFilter] = useState<string[]>([]);
  const [followPlayer, setFollowPlayer] = useState(true);
  // const [isMapSettingsOpen, setIsMapControlsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MainMenuItem>(null);
  const toggleMenu = (menu: MainMenuItem) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <div className="relative h-screen w-full">
      <MapControls
        filter={filter}
        setFilter={setFilter}
        followPlayer={followPlayer}
        setFollowPlayer={setFollowPlayer}
        mapRef={mapRef}
        isOpen={activeMenu === 'map'}
        onClose={() => setActiveMenu(null)}
      />
      <QuestsList
        isOpen={activeMenu === 'quests'}
        onClose={() => setActiveMenu(null)}
      />
      <BackpackBottomSheet
        isOpen={activeMenu === 'inventory'}
        onClose={() => setActiveMenu(null)}
      />
      <TopUI />
      <MainMenu
        activeMenu={activeMenu}
        onMapSettings={() => toggleMenu('map')}
        onQuests={() => toggleMenu('quests')}
        onInventory={() => toggleMenu('inventory')}
        onProfile={() => toggleMenu('profile')}
      />
      <LoginRegisterButton
        onClick={() => setModalOpen(true)}
        userEmail={userEmail}
        isOpen={activeMenu === 'profile'}
        onClose={() => setActiveMenu(null)}
      />
      <LoginRegisterModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={(email) => {
          setUserEmail(email); // ← сохраняем email
          setModalOpen(false); // ← закрываем модалку
        }}
      />
      <MapComponent mapRef={mapRef} followPlayer={false} />
    </div>
  );
}

export default App;
