interface MainMenuProps {
  activeMenu: 'map' | 'quests' | 'inventory' | 'profile' | null;
  onMapSettings: () => void;
  onQuests: () => void;
  onInventory: () => void;
  onProfile: () => void;
}

export default function MainMenu({
  activeMenu,
  onMapSettings,
  onQuests,
  onInventory,
  onProfile,
}: MainMenuProps) {
  const base = 'flex flex-col items-center gap-1 transition';
  const active = 'text-blue-400';
  const inactive = 'text-white hover:text-blue-400';

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-xs flex justify-around items-center py-2 shadow-md z-[1001]">
      <button
        onClick={onMapSettings}
        className={`${base} ${activeMenu === 'map' ? active : inactive}`}
      >
        🗺️
      </button>

      <button
        onClick={onQuests}
        className={`${base} ${
          activeMenu === 'quests' ? 'text-yellow-400' : 'hover:text-yellow-400'
        }`}
      >
        📜
      </button>

      <button
        onClick={onInventory}
        className={`${base} ${
          activeMenu === 'inventory' ? 'text-green-400' : 'hover:text-green-400'
        }`}
      >
        🎒
      </button>

      <button
        onClick={onProfile}
        className={`${base} ${
          activeMenu === 'profile' ? 'text-purple-400' : 'hover:text-purple-400'
        }`}
      >
        👤
      </button>
    </nav>
  );
}
