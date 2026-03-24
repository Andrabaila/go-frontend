import { useCallback, useEffect, useMemo, useState } from 'react';
import { questsApi, type Quest } from '@/api/quests';

interface QuestsShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

type QuestStatus = Quest['status'];

type StatusMeta = {
  label: string;
  classes: string;
};

const statusMeta: Record<QuestStatus, StatusMeta> = {
  active: {
    label: 'Активный',
    classes: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100',
  },
  completed: {
    label: 'Завершен',
    classes: 'border-sky-400/40 bg-sky-500/15 text-sky-100',
  },
  pending: {
    label: 'Неактивен',
    classes: 'border-amber-400/40 bg-amber-500/15 text-amber-100',
  },
};

const statusPriority: Record<QuestStatus, number> = {
  active: 0,
  pending: 1,
  completed: 2,
};

export default function QuestsShowcase({
  isOpen,
  onClose,
}: QuestsShowcaseProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await questsApi.getQuests();
      setQuests(data);
    } catch (err) {
      console.error('Failed to load quests showcase:', err);
      setError('Не удалось загрузить витрину квестов.');
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
      const byStatus = statusPriority[a.status] - statusPriority[b.status];
      if (byStatus !== 0) return byStatus;
      return a.title.localeCompare(b.title, 'ru');
    });
  }, [quests]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1004] bg-slate-950/90"
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 p-4 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Витрина квестов
            </p>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Все квесты
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Всего: {quests.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            aria-label="Закрыть витрину"
          >
            Закрыть
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid place-items-center py-16 text-sm text-slate-300">
              Загружаем карточки квестов...
            </div>
          ) : error ? (
            <div className="grid place-items-center gap-3 py-16 text-center text-sm text-slate-200">
              <p>{error}</p>
              <button
                onClick={() => void loadQuests()}
                className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/60"
              >
                Повторить загрузку
              </button>
            </div>
          ) : ordered.length === 0 ? (
            <div className="grid place-items-center py-16 text-sm text-slate-300">
              Квестов пока нет.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((quest) => {
                const meta = statusMeta[quest.status];
                const objectives = quest.objectives?.type === 'visit_points'
                  ? quest.objectives
                  : null;
                return (
                  <article
                    key={quest.id}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold leading-snug">
                        {quest.title}
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
                      {quest.description}
                    </p>
                    {objectives && (
                      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <span className="rounded-full border border-white/15 px-3 py-1">
                          Точек: {objectives.points.length}
                        </span>
                        <span className="rounded-full border border-white/15 px-3 py-1">
                          Нужно: {objectives.requiredCount}
                        </span>
                        <span className="rounded-full border border-white/15 px-3 py-1">
                          Радиус: {objectives.radiusMeters} м
                        </span>
                      </div>
                    )}
                    {!objectives && (
                      <div className="mt-auto text-xs text-slate-400">
                        Без гео-задач
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
