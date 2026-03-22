import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { GoinsLayer, PlayerMarker, QuestPointsLayer } from '@/components';
import type { Quest } from '@/api/quests';

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
  followPlayer: boolean;
  playerPosition: [number, number] | null;
}

export default function MapComponent({
  mapRef,
  followPlayer,
  playerPosition,
}: Props) {
  const [completionNotice, setCompletionNotice] = useState<{
    title: string;
    rewardText: string | null;
  } | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  const internalMapRef = useRef<LeafletMap>(null);
  const [mapReady, setMapReady] = useState(false);
  const hasCenteredOnPlayer = useRef(false);

  const defaultCenter = playerPosition ?? [52.1506, 21.0336];

  const handleQuestCompleted = (quest: Quest) => {
    const rewardText = quest.reward
      ? [
          quest.reward.gold != null ? `${quest.reward.gold} монет` : null,
          quest.reward.item ? quest.reward.item : null,
        ]
          .filter(Boolean)
          .join(', ')
      : null;
    setCompletionNotice({
      title: quest.title,
      rewardText: rewardText && rewardText.length > 0 ? rewardText : null,
    });
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setCompletionNotice(null);
      noticeTimerRef.current = null;
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!playerPosition || !internalMapRef.current || !mapReady) return;
    if (hasCenteredOnPlayer.current) return;
    internalMapRef.current.setView(
      playerPosition,
      internalMapRef.current.getZoom()
    );
    hasCenteredOnPlayer.current = true;
  }, [playerPosition, mapReady]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {completionNotice && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[1001] w-[90%] max-w-sm -translate-x-1/2 animate-bounce rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-lg">
          <div className="font-semibold">
            Квест завершён: {completionNotice.title}
          </div>
          {completionNotice.rewardText && (
            <div className="text-xs text-green-700">
              Награда: {completionNotice.rewardText}
            </div>
          )}
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={22}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        ref={(mapInstance: LeafletMap) => {
          if (!mapInstance) return;
          mapRef.current = mapInstance;
          internalMapRef.current = mapInstance;
          setMapReady(true);
        }}
      >
        <PlayerMarker position={playerPosition} follow={followPlayer} />
        <GoinsLayer playerPosition={playerPosition} />
        <QuestPointsLayer
          playerPosition={playerPosition}
          onQuestCompleted={handleQuestCompleted}
        />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}
