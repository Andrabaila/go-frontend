import { useEffect, useState } from 'react';
import { getBackpack, removeFromBackpack } from '@/assets/data/backpackStorage';
import type { BackpackItem } from '@/types';
import { BackpackList } from '@/components/';

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
    const confirmed = window.confirm(`Remove "${name}" from your backpack?`);
    if (!confirmed) return;

    removeFromBackpack(name);
    setItems(getBackpack());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1004] bg-slate-950/90" onClick={onClose}>
      <div
        className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Inventory
            </p>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Backpack
            </h2>
            <p className="mt-1 text-sm text-slate-300">Total: {items.length}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            aria-label="Close backpack"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <BackpackList items={items} onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
}
