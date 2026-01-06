import type { BackpackItem } from '@shared/types';
import { Trash2 } from 'lucide-react';

interface Props {
  item: BackpackItem;
  onRemove: (name: string) => void;
}

export default function BackpackItemRow({ item, onRemove }: Props) {
  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '4px',
      }}
    >
      <span>
        <strong>{item.name}</strong> × {item.quantity}
      </span>
      <span title="Выбросить предмет">
        <Trash2
          size={18}
          className="cursor-pointer text-red-600 hover:text-red-800"
          onClick={() => onRemove(item.name)}
        />
      </span>
    </li>
  );
}
