import { CircleDollarSign } from 'lucide-react';
import { useMap } from 'react-leaflet';
import { addToBackpack } from '@/assets/data/backpackStorage';
import type { BaseItem } from '@/types';

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
      <p className="text-sm text-center">New godsend!</p>
      <CircleDollarSign size={48} color="green" />
      <p className="text-center font-bold">{name}</p>
      <p className="text-sm">Вес: {weight}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleTake}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Взять
        </button>
        <button
          onClick={handleLeave}
          className="px-3 py-1 bg-gray-300 text-white rounded hover:bg-gray-400"
        >
          Оставить
        </button>
      </div>
    </div>
  );
}
