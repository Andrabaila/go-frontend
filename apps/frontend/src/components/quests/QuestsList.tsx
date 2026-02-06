import { useState, useEffect } from 'react';
import { questsApi, type Quest } from '../../api/quests';

interface QuestsListProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Компонент для отображения списка квестов в модальном окне.
 * Загружает квесты асинхронно при открытии для оптимизации производительности.
 * @param isOpen - Флаг видимости модального окна
 * @param onClose - Функция закрытия модального окна
 */
export default function QuestsList({ isOpen, onClose }: QuestsListProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadQuests();
    }
  }, [isOpen]);

  const loadQuests = async () => {
    setLoading(true);
    try {
      const data = await questsApi.getQuests();
      setQuests(data);
    } catch (error) {
      console.error('Failed to load quests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1002] flex items-end justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold">Квесты</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {quests.map((quest) => (
              <li
                key={quest.id}
                className={`rounded border p-2 ${
                  quest.status === 'completed'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="font-semibold">{quest.title}</h3>
                <p className="text-sm text-gray-600">{quest.description}</p>
                {quest.objectives?.type === 'visit_points' && (
                  <div className="mt-1 text-xs text-gray-500">
                    Прогресс: {quest.progress?.visitedPointIds?.length ?? 0}/
                    {quest.objectives.requiredCount}
                  </div>
                )}
                {quest.reward && (
                  <div
                    className={`mt-1 text-xs ${
                      quest.status === 'completed'
                        ? 'text-green-700'
                        : 'text-gray-500'
                    }`}
                  >
                    Награда:{' '}
                    {[
                      quest.reward.gold != null
                        ? `${quest.reward.gold} монет`
                        : null,
                      quest.reward.item ? quest.reward.item : null,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                )}
                {quest.status === 'completed' && (
                  <div className="mt-2 inline-flex animate-pulse items-center rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    Квест завершён
                  </div>
                )}
                <span
                  className={`text-xs ${
                    quest.status === 'active'
                      ? 'text-blue-500'
                      : quest.status === 'completed'
                        ? 'text-green-500'
                        : 'text-gray-500'
                  }`}
                >
                  {quest.status === 'active'
                    ? 'Активный'
                    : quest.status === 'completed'
                      ? 'Завершен'
                      : 'Ожидает'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
