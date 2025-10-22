import React from 'react';

interface Props {
  onClick: () => void;
}

export default function BackpackButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: 150,
        left: 10,
        zIndex: 1000,
        padding: '8px 12px',
        backgroundColor: '#4b5563',
        color: 'white',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      Рюкзак
    </button>
  );
}
