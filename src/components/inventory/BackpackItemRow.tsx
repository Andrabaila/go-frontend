import type { BackpackItem } from '@/types';
import { Trash2 } from 'lucide-react';

interface Props {
  item: BackpackItem;
  onRemove: (name: string) => void;
}

export default function BackpackItemRow({ item, onRemove }: Props) {
  return (
    <li className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold leading-snug">{item.name}</h3>
          {item.description && (
            <p className="mt-2 text-sm text-slate-200">{item.description}</p>
          )}
        </div>
        <span className="rounded-full border border-sky-400/40 bg-sky-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-100">
          Item
        </span>
      </div>

      <div className="mt-auto grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Quantity
          </p>
          <p className="mt-1 font-semibold">{item.quantity}</p>
        </div>
        <button
          type="button"
          title="Remove item"
          aria-label={`Remove ${item.name}`}
          onClick={() => onRemove(item.name)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/15 text-rose-100 transition hover:border-rose-300/60 hover:bg-rose-500/25"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
