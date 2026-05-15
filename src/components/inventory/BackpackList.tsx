import type { BackpackItem } from '@/types';
import { BackpackItemRow } from '@/components';

interface Props {
  items: BackpackItem[];
  onRemove: (name: string) => void;
}

export default function BackpackList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div className="grid place-items-center py-16 text-sm text-slate-300">
        Your backpack is empty.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <BackpackItemRow key={item.name} item={item} onRemove={onRemove} />
      ))}
    </ul>
  );
}
