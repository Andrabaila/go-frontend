// src/components/ui/ButtonFollowPlayer.tsx

interface Props {
  follow: boolean;
  onToggle: () => void;
}

export default function ButtonFollowPlayer({ follow, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={`
        absolute top-10 right-3 z-[1000]
        px-3 py-2
        bg-gray-600 text-white
        rounded-md
        font-bold
        cursor-pointer
        ${follow ? 'bg-green-700' : 'bg-gray-600'}
       `}
    >
      {follow ? 'Следить за игроком' : 'Свободный режим'}
    </button>
  );
}
