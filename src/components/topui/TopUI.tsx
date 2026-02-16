import { StatusBar } from '@/components';

/**
 * Верхний UI компонент со статус-баром и кнопкой меню.
 * Фиксированное позиционирование для overlay на карте.
 */
export default function TopUI() {
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[1000] h-0">
      <div className="pointer-events-auto w-full">
        <StatusBar />
      </div>

      {/* Бургер */}
      <div className="pointer-events-auto mt-2 flex h-0 justify-end pr-2">
        <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900/80 text-white shadow-md">
          ☰
        </button>
      </div>
    </div>
  );
}
