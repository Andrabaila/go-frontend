import { useEffect, useState } from 'react';
import { getBackpack, removeFromBackpack } from '@/assets/data/backpackStorage';
import type { BackpackItem } from '@shared/types';
import BackpackList from '@/components/player/BackpackList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 2000,
        }}
      />

      {/* bottom sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '85vh',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '16px',
          overflowY: 'auto',
          zIndex: 2001,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* drag handle */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#d1d5db',
            borderRadius: '2px',
            margin: '0 auto 12px',
          }}
        />

        <h2 style={{ marginBottom: '12px' }}>Рюкзак</h2>

        <BackpackList items={items} onRemove={handleRemove} />

        <button
          onClick={onClose}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '10px',
            backgroundColor: '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Закрыть
        </button>
      </div>
    </>
  );
}
