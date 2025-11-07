import { useEffect, useState } from 'react';
import { getBackpack, removeFromBackpack } from '@/assets/data/backpackStorage';
import type { BackpackItem } from '@shared/types';
import BackpackList from '@/components/player/BackpackList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackpackPopup({ isOpen, onClose }: Props) {
  const [items, setItems] = useState<BackpackItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setItems(getBackpack());
    }
  }, [isOpen]);

  const handleRemove = (name: string) => {
    const confirmed = window.confirm(`Выбросить "${name}" из рюкзака?`);
    if (confirmed) {
      removeFromBackpack(name);
      setItems(getBackpack());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          width: '400px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ marginBottom: '12px' }}>Рюкзак</h2>

        <BackpackList items={items} onRemove={handleRemove} />

        <button
          onClick={onClose}
          style={{
            marginTop: '12px',
            padding: '6px 10px',
            backgroundColor: '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
