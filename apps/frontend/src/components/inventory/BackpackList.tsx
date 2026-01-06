import type { BackpackItem } from '@shared/types';
import { BackpackItemRow } from '@/components';

interface Props {
  items: BackpackItem[];
  onRemove: (name: string) => void;
}

export default function BackpackList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return <p>Рюкзак пустой</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item) => (
        <BackpackItemRow key={item.name} item={item} onRemove={onRemove} />
      ))}
    </ul>
  );
}
