// src/components/ui/FollowPlayerButton.tsx

interface Props {
  follow: boolean;
  onToggle: () => void;
}

export default function FollowPlayerButton({ follow, onToggle }: Props) {
  return (
    <div
      className={`bg-gray-200 border border-gray-400 rounded p-4 text-center`}
    >
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: '6px 10px',
          background: follow ? '#2d8f2d' : '#555',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        {follow ? 'Следить за игроком' : 'Свободный режим'}
      </button>
    </div>
  );
}
