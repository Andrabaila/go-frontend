import { CircleDollarSign } from 'lucide-react';
import { useMap } from 'react-leaflet';
import { addToBackpack } from '@/assets/data/backpackStorage';
import type { BaseItem } from '@shared/types';

interface Props extends BaseItem {
  onTake: (id: string) => void;
}

export default function PopupGodsend({
  id,
  name,
  weight,
  value,
  onTake,
}: Props) {
  const map = useMap();

  const handleLeave = () => {
    map.closePopup();
  };

  const handleTake = () => {
    // добавляем в рюкзак
    addToBackpack({
      id: id,
      name: name,
      type: 'backpackItem',
      weight: weight,
      value: value,
    });
    onTake(id);
    map.closePopup();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-center text-sm">New godsend!</p>
      <CircleDollarSign size={48} color="green" />
      <p className="text-center font-bold">{name}</p>
      <p className="text-sm">Вес: {weight}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleTake}
          className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
        >
          Взять
        </button>
        <button
          onClick={handleLeave}
          className="rounded bg-gray-300 px-3 py-1 text-white hover:bg-gray-400"
        >
          Оставить
        </button>
      </div>
    </div>
  );
}
