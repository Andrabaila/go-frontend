import { CircleDollarSign } from 'lucide-react';
import { useMap } from 'react-leaflet';

interface Props {
  id: string;
  description: string;
  image: string;
  onTake: (id: string) => void;
}

export default function PopupGodsend({ id, description, onTake }: Props) {
  const map = useMap();

  const handleLeave = () => {
    map.closePopup(); // закрывает активный попап
  };

  const handleTake = () => {
    onTake(id);
    map.closePopup(); // закрываем попап после взятия
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <CircleDollarSign />
      <p className="text-sm text-center">{description}</p>
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
