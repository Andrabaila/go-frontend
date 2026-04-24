import '@/assets/styles/global.css';
import 'leaflet/dist/leaflet.css';
import { useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { getStoredUserEmail } from '@/api/auth';
import {
  AboutModal,
  MapComponent,
  TopUI,
  BackpackBottomSheet,
  LoginRegisterModal,
  LoginRegisterButton,
  MapControls,
  MainMenu,
  QuestsList,
  QuestsShowcase,
} from '@/components';
import { usePlayerPosition } from '@/hooks/usePlayerPosition';
type MainMenuItem =
  | 'showcase'
  | 'map'
  | 'quests'
  | 'inventory'
  | 'profile'
  | null;

function App() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    getStoredUserEmail()
  );
  const [playerPosition, setPlayerPosition] = useState<[number, number] | null>(
    () => {
      const stored = localStorage.getItem('playerPosition');
      return stored ? (JSON.parse(stored) as [number, number]) : null;
    }
  );
  const [activeMenu, setActiveMenu] = useState<MainMenuItem>(null);
  const toggleMenu = (menu: MainMenuItem) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };
  usePlayerPosition(true, setPlayerPosition);

  return (
    <div className="relative h-screen w-full">
      <MapControls
        mapRef={mapRef}
        onPlayerPositionChange={setPlayerPosition}
        isOpen={activeMenu === 'map'}
      />
      <QuestsShowcase
        isOpen={activeMenu === 'showcase'}
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
      <TopUI onOpenAbout={() => setAboutOpen(true)} />
      <MainMenu
        activeMenu={activeMenu}
        onShowcase={() => toggleMenu('showcase')}
        onMapSettings={() => toggleMenu('map')}
        onQuests={() => toggleMenu('quests')}
        onInventory={() => toggleMenu('inventory')}
        onProfile={() => toggleMenu('profile')}
      />
      <LoginRegisterButton
        onClick={() => setModalOpen(true)}
        userEmail={userEmail}
        isOpen={activeMenu === 'profile'}
      />
      <LoginRegisterModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={(email) => {
          setUserEmail(email);
          setModalOpen(false);
        }}
      />
      <AboutModal isOpen={isAboutOpen} onClose={() => setAboutOpen(false)} />
      <MapComponent
        mapRef={mapRef}
        followPlayer={false}
        playerPosition={playerPosition}
      />
    </div>
  );
}

export default App;
