import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  questsApi,
  type Quest,
  USER_QUESTS_UPDATED_EVENT,
} from '../../api/quests';

interface QuestsListProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}

type StatusMeta = {
  label: string;
  classes: string;
};

const statusMeta: Record<Quest['status'], StatusMeta> = {
  active: {
    label: 'Active',
    classes: 'border-blue-400/40 bg-blue-500/15 text-blue-100',
  },
  completed: {
    label: 'Completed',
    classes: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100',
  },
  pending: {
    label: 'Pending',
    classes: 'border-amber-400/40 bg-amber-500/15 text-amber-100',
  },
};

const statusOrder: Record<Quest['status'], number> = {
  active: 0,
  pending: 1,
  completed: 2,
};

const numberFormatter = new Intl.NumberFormat('en-US');

function getProgress(quest: Quest) {
  if (quest.objectives?.type !== 'visit_points') return null;

  const visitedCount = quest.progress?.visitedPointIds?.length ?? 0;
  const requiredCount = quest.objectives.requiredCount;
  const percent =
    requiredCount > 0
      ? Math.min(100, Math.round((visitedCount / requiredCount) * 100))
      : 0;

  return { visitedCount, requiredCount, percent };
}

function formatReward(quest: Quest) {
  if (!quest.reward) return null;

  return [
    quest.reward.gold != null
      ? `${numberFormatter.format(quest.reward.gold)} coins`
      : null,
    quest.reward.item ? quest.reward.item : null,
  ]
    .filter(Boolean)
    .join(', ');
}

export default function QuestsList({
  isOpen,
  onClose,
  isAuthenticated,
}: QuestsListProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await questsApi.getMyQuests();
      setQuests(data);
    } catch (error) {
      console.error('Failed to load quests:', error);
      setError('Failed to load your quests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (!isAuthenticated) {
      setQuests([]);
      setError(null);
      return;
    }

    void loadQuests();

    const handleUserQuestsUpdated = () => {
      void loadQuests();
    };

    window.addEventListener(USER_QUESTS_UPDATED_EVENT, handleUserQuestsUpdated);
    return () => {
      window.removeEventListener(
        USER_QUESTS_UPDATED_EVENT,
        handleUserQuestsUpdated
      );
    };
  }, [isAuthenticated, isOpen, loadQuests]);

  const ordered = useMemo(() => {
    return [...quests].sort((a, b) => {
      const byStatus = statusOrder[a.status] - statusOrder[b.status];
      if (byStatus !== 0) return byStatus;
      return (a.title ?? '').localeCompare(b.title ?? '', 'en');
    });
  }, [quests]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] bg-slate-950/90" onClick={onClose}>
      <div
        className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 p-4 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Quest Log
            </p>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              My Quests
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Total: {quests.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            aria-label="Close my quests"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            <div className="grid place-items-center py-16 text-center text-sm text-slate-300">
              Sign in to view your active quests.
            </div>
          ) : loading ? (
            <div className="grid place-items-center py-16 text-sm text-slate-300">
              Loading your quests...
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
              No active quests yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((quest) => {
                const meta = statusMeta[quest.status];
                const progress = getProgress(quest);
                const reward = formatReward(quest);

                return (
                  <article
                    key={quest.id}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold leading-snug">
                        {quest.title || 'Untitled Quest'}
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${meta.classes}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <p className="text-sm text-slate-200">
                      {quest.description || 'Description coming soon.'}
                    </p>

                    {progress && (
                      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                          <span className="uppercase tracking-wide text-slate-400">
                            Progress
                          </span>
                          <span className="font-semibold text-white">
                            {progress.visitedCount}/{progress.requiredCount}
                          </span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {reward && (
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Reward
                        </p>
                        <p className="mt-1 font-semibold">{reward}</p>
                      </div>
                    )}

                    {quest.status === 'completed' && (
                      <div className="inline-flex w-max animate-pulse items-center rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                        Quest completed
                      </div>
                    )}
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
