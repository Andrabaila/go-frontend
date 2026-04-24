import { useState } from 'react';
import { StatusBar } from '@/components';

interface TopUIProps {
  onOpenAbout: () => void;
}

/**
 * Верхний UI компонент со статус-баром и кнопкой меню.
 * Фиксированное позиционирование для overlay на карте.
 */
export default function TopUI({ onOpenAbout }: TopUIProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAboutClick = () => {
    setIsMenuOpen(false);
    onOpenAbout();
  };

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[1000] h-0">
      <div className="pointer-events-auto w-full">
        <StatusBar />
      </div>

      {/* Бургер */}
      <div className="pointer-events-auto relative mt-2 flex h-0 justify-end pr-2">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900/80 text-white shadow-md"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          aria-label="Open top menu"
        >
          ☰
        </button>

        {isMenuOpen ? (
          <div className="top-13 absolute right-2 min-w-40 overflow-hidden rounded-2xl bg-gray-900/95 text-white shadow-xl">
            <button
              type="button"
              className="block w-full px-4 py-3 text-left text-sm transition hover:bg-white/10"
              onClick={handleAboutClick}
            >
              About
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
