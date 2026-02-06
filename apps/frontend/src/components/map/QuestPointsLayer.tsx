import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { questsApi, type Quest } from '@/api/quests';
import getDistanceMeters from '@/components/map/utils/getDistanceMeters';
import {
  questActiveIcon,
  questInactiveIcon,
  questVisitedIcon,
} from './utils/questIcon';

type QuestPoint = {
  id: string;
  questId: string;
  questTitle: string;
  label?: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  requiredCount: number;
  orderIndex: number;
};

interface Props {
  playerPosition: [number, number] | null;
  onQuestCompleted?: (quest: Quest) => void;
}

type VisitedByQuest = Record<string, Record<string, true>>;

export default function QuestPointsLayer({
  playerPosition,
  onQuestCompleted,
}: Props) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [visited, setVisited] = useState<VisitedByQuest>({});
  const lastSyncedRef = useRef<Record<string, string>>({});
  const completedNotifiedRef = useRef<Record<string, true>>({});

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await questsApi.getQuests();
        if (alive) setQuests(data);
      } catch (error) {
        console.error('Failed to load quest points:', error);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  const points = useMemo<QuestPoint[]>(() => {
    const result: QuestPoint[] = [];
    quests.forEach((quest) => {
      const objectives = quest.objectives;
      if (!objectives || objectives.type !== 'visit_points') return;
      objectives.points.forEach((point, orderIndex) => {
        if (point.lat == null || point.lng == null) return;
        result.push({
          id: point.id,
          questId: quest.id,
          questTitle: quest.title,
          label: point.label,
          lat: point.lat,
          lng: point.lng,
          radiusMeters: objectives.radiusMeters,
          requiredCount: objectives.requiredCount,
          orderIndex,
        });
      });
    });
    return result;
  }, [quests]);

  const orderedPointsByQuest = useMemo(() => {
    const map = new Map<string, QuestPoint[]>();
    points.forEach((point) => {
      const list = map.get(point.questId) ?? [];
      list.push(point);
      map.set(point.questId, list);
    });
    map.forEach((list) => list.sort((a, b) => a.orderIndex - b.orderIndex));
    return map;
  }, [points]);

  useEffect(() => {
    if (quests.length === 0) return;
    const initial: VisitedByQuest = {};
    quests.forEach((quest) => {
      const ids = quest.progress?.visitedPointIds ?? [];
      if (ids.length === 0) return;
      const set: Record<string, true> = {};
      ids.forEach((id) => {
        set[id] = true;
      });
      initial[quest.id] = set;
    });
    setVisited((prev) => (Object.keys(prev).length === 0 ? initial : prev));
  }, [quests]);

  useEffect(() => {
    if (!playerPosition || points.length === 0) return;
    setVisited((prev) => {
      let changed = false;
      const next: VisitedByQuest = { ...prev };

      orderedPointsByQuest.forEach((list, questId) => {
        const questVisited = next[questId] ?? { ...next[questId] };
        const visitedCount = Object.keys(questVisited).length;
        const nextTarget = list[visitedCount];
        if (!nextTarget) return;
        const distance = getDistanceMeters(playerPosition, [
          nextTarget.lat,
          nextTarget.lng,
        ]);
        if (distance > nextTarget.radiusMeters) return;
        if (!questVisited[nextTarget.id]) {
          questVisited[nextTarget.id] = true;
          next[questId] = questVisited;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [playerPosition, orderedPointsByQuest, points.length]);

  useEffect(() => {
    const questIds = new Set(points.map((p) => p.questId));
    questIds.forEach((questId) => {
      const ids = Object.keys(visited[questId] ?? {}).sort();
      const signature = ids.join('|');
      if (lastSyncedRef.current[questId] === signature) return;
      lastSyncedRef.current[questId] = signature;
      void questsApi.updateQuestProgress(questId, ids).catch((error) => {
        console.error('Failed to save quest progress:', error);
      });
    });
  }, [points, visited]);

  useEffect(() => {
    quests.forEach((quest) => {
      if (quest.status === 'completed') {
        completedNotifiedRef.current[quest.id] = true;
      }
    });
  }, [quests]);

  useEffect(() => {
    if (!onQuestCompleted) return;
    const byId = new Map(quests.map((q) => [q.id, q]));
    points.forEach((point) => {
      const quest = byId.get(point.questId);
      if (!quest || quest.objectives?.type !== 'visit_points') return;
      const visitedCount = Object.keys(visited[quest.id] ?? {}).length;
      if (visitedCount < quest.objectives.requiredCount) return;
      if (completedNotifiedRef.current[quest.id]) return;
      completedNotifiedRef.current[quest.id] = true;
      onQuestCompleted(quest);
    });
  }, [onQuestCompleted, points, quests, visited]);

  const progressByQuest = useMemo(() => {
    const progress: Record<string, { visited: number; required: number }> = {};
    points.forEach((point) => {
      const visitedCount = Object.keys(visited[point.questId] ?? {}).length;
      progress[point.questId] = {
        visited: visitedCount,
        required: point.requiredCount,
      };
    });
    return progress;
  }, [points, visited]);

  return (
    <>
      {points.map((point) => {
        const isVisited = Boolean(visited[point.questId]?.[point.id]);
        const progress = progressByQuest[point.questId];
        const progressText = progress
          ? `${progress.visited}/${progress.required}`
          : '0/0';
        const ordered = orderedPointsByQuest.get(point.questId) ?? [];
        const nextTarget = ordered[progress?.visited ?? 0];
        const isActive = Boolean(nextTarget?.id === point.id);
        const icon = isVisited
          ? questVisitedIcon
          : isActive
            ? questActiveIcon
            : questInactiveIcon;
        return (
          <Marker
            key={`${point.questId}:${point.id}`}
            position={[point.lat, point.lng]}
            icon={icon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{point.questTitle}</div>
                <div className="text-gray-600">{point.label ?? 'Метка'}</div>
                <div className="mt-1 text-xs text-gray-500">
                  Прогресс: {progressText}
                </div>
                <div className="text-xs text-gray-500">
                  {isVisited
                    ? 'Метка засчитана'
                    : isActive
                      ? `Текущая цель: подойди на ${point.radiusMeters} м`
                      : 'Сначала пройди предыдущую метку'}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
