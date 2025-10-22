import { useEffect, useState } from 'react';
import { getBackpack } from '@/assets/data/backpackStorage';
import type { BackpackItem } from '@/assets/data/backpackStorage';

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
        {items.length === 0 ? (
          <p>Рюкзак пустой</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: '8px' }}>
                <strong>{item.name}</strong> x {item.quantity}
              </li>
            ))}
          </ul>
        )}
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
