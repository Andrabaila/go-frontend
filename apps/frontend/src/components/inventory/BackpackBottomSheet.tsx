import { useEffect, useState } from 'react';
import { getBackpack, removeFromBackpack } from '@/assets/data/backpackStorage';
import type { BackpackItem } from '@shared/types';
import { BackpackList } from '@/components/';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Нижний sheet для отображения инвентаря игрока.
 * Загружает предметы из localStorage при открытии.
 * @param isOpen - Флаг видимости sheet
 * @param onClose - Функция закрытия sheet
 */
export default function BackpackBottomSheet({ isOpen, onClose }: Props) {
  const [items, setItems] = useState<BackpackItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setItems(getBackpack());
    }
  }, [isOpen]);

  const handleRemove = (name: string) => {
    const confirmed = window.confirm(`Выбросить "${name}" из рюкзака?`);
    if (!confirmed) return;

    removeFromBackpack(name);
    setItems(getBackpack());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* затемнение */}
      <div onClick={onClose} className="fixed inset-0 z-[2000] bg-black/40" />

      {/* bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[2001] max-h-[85vh] min-h-[40vh] overflow-y-auto rounded-md bg-gray-600/80 p-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* drag handle */}
        <div className="mx-auto mb-3 h-4 w-10 rounded-sm bg-gray-300" />

        <h2 style={{ marginBottom: '12px' }}>Рюкзак</h2>

        <BackpackList items={items} onRemove={handleRemove} />

        <button
          onClick={onClose}
          className="mt-3 w-full cursor-pointer rounded-lg bg-gray-600 p-2.5 text-white"
        >
          Закрыть
        </button>
      </div>
    </>
  );
}
