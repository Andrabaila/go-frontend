import { useCallback, useEffect, useMemo, useState } from 'react';
import { questsApi, type QuestShowcaseItem } from '@/api/quests';

interface QuestsShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

type StatusMeta = {
  label: string;
  classes: string;
};

const statusMeta: Record<'active' | 'inactive', StatusMeta> = {
  active: {
    label: 'Available',
    classes: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100',
  },
  inactive: {
    label: 'Inactive',
    classes: 'border-amber-400/40 bg-amber-500/15 text-amber-100',
  },
};

const difficultyLabels: Record<number, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
  4: 'Expert',
  5: 'Extreme',
};

const numberFormatter = new Intl.NumberFormat('en-US');

function formatDistance(distance: number) {
  if (distance >= 1000) {
    return `${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
    }).format(distance / 1000)} km`;
  }
  return `${numberFormatter.format(distance)} m`;
}

function formatDuration(duration: number) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (!hours) return `${duration} min`;
  if (!minutes) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function formatPrice(price: number) {
  if (price === 0) return 'Free';
  return `$${numberFormatter.format(price)}`;
}

function getDifficultyLabel(difficulty: number) {
  return difficultyLabels[difficulty] ?? `${difficulty}/5`;
}

export default function QuestsShowcase({
  isOpen,
  onClose,
}: QuestsShowcaseProps) {
  const [quests, setQuests] = useState<QuestShowcaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<QuestShowcaseItem | null>(
    null
  );

  const loadQuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await questsApi.getShowcaseQuests();
      setQuests(data);
    } catch (err) {
      console.error('Failed to load quests showcase:', err);
      setError('Failed to load the quest showcase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    void loadQuests();
  }, [isOpen, loadQuests]);

  const ordered = useMemo(() => {
    return [...quests].sort((a, b) => {
      const byStatus = Number(b.is_active) - Number(a.is_active);
      if (byStatus !== 0) return byStatus;
      return (a.title ?? '').localeCompare(b.title ?? '', 'en');
    });
  }, [quests]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1004] bg-slate-950/90" onClick={onClose}>
      <div
        className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 p-4 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        {selectedQuest && (
          <div
            className="fixed inset-0 z-[1005] bg-slate-950/95"
            onClick={() => setSelectedQuest(null)}
          >
            <div
              className="mx-auto flex h-full w-full max-w-4xl flex-col gap-4 p-4 sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Quest Details
                  </p>
                  <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                    {selectedQuest.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedQuest(null)}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                  aria-label="Close quest details"
                >
                  Back
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      statusMeta[
                        selectedQuest.is_active ? 'active' : 'inactive'
                      ].classes
                    }`}
                  >
                    {
                      statusMeta[
                        selectedQuest.is_active ? 'active' : 'inactive'
                      ].label
                    }
                  </span>
                  {selectedQuest.city && (
                    <span className="rounded-full border border-white/15 px-3 py-1">
                      {selectedQuest.city}
                    </span>
                  )}
                  {selectedQuest.district && (
                    <span className="rounded-full border border-white/15 px-3 py-1">
                      {selectedQuest.district}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm text-slate-200">
                  {selectedQuest.description || 'Description coming soon.'}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Duration
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatDuration(selectedQuest.duration)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Distance
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatDistance(selectedQuest.distance)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Difficulty
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {getDifficultyLabel(selectedQuest.difficulty)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Price
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatPrice(selectedQuest.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Quest Showcase
            </p>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              All Quests
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Total: {quests.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            aria-label="Close showcase"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid place-items-center py-16 text-sm text-slate-300">
              Loading quest cards...
            </div>
          ) : error ? (
            <div className="grid place-items-center gap-3 py-16 text-center text-sm text-slate-200">
              <p>{error}</p>
              <button
                onClick={() => void loadQuests()}
                className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/60"
              >
                Retry
              </button>
            </div>
          ) : ordered.length === 0 ? (
            <div className="grid place-items-center py-16 text-sm text-slate-300">
              No quests yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((quest) => {
                const meta =
                  statusMeta[quest.is_active ? 'active' : 'inactive'];
                return (
                  <article
                    key={quest.id}
                    onClick={() => setSelectedQuest(quest)}
                    className="flex h-full cursor-pointer flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-white/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold leading-snug">
                        {quest.title || 'Untitled Quest'}
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                          meta.classes
                        }`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200">
                      {quest.description || 'Description coming soon.'}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-slate-300">
                      {quest.city && (
                        <span className="rounded-full border border-white/15 px-3 py-1">
                          {quest.city}
                        </span>
                      )}
                      {quest.district && (
                        <span className="rounded-full border border-white/15 px-3 py-1">
                          {quest.district}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Duration
                        </p>
                        <p className="mt-1 font-semibold">
                          {formatDuration(quest.duration)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Distance
                        </p>
                        <p className="mt-1 font-semibold">
                          {formatDistance(quest.distance)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Difficulty
                        </p>
                        <p className="mt-1 font-semibold">
                          {getDifficultyLabel(quest.difficulty)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Price
                        </p>
                        <p className="mt-1 font-semibold">
                          {formatPrice(quest.price)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
