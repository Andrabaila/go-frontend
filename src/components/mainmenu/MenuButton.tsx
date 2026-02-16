interface MenuButtonProps {
  type: 'map' | 'quests' | 'inventory' | 'profile';
  activeMenu: 'map' | 'quests' | 'inventory' | 'profile' | null;
  onClick: () => void;
  icon: string;
}

export default function MenuButton({
  type,
  activeMenu,
  onClick,
  icon,
}: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent p-2 text-xl transition-colors transition-transform duration-100 duration-200 ease-in-out hover:scale-110 ${
        activeMenu === type ? 'text-blue-500' : 'text-white'
      }`}
    >
      {icon}
    </button>
  );
}
