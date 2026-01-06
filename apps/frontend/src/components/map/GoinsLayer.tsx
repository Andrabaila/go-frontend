import { Marker, Popup } from 'react-leaflet';
import PopupGodsend from '@/components/map/PopupGodsend';
import { useCoins } from '@/hooks/useCoins';
import { coinIcon } from './utils/coinIcon';
import { filterVisibleCoins } from './utils/filterVisibleCoins';
import { PLAYER_VISIBLE_RADIUS } from '@/constants/map';

interface Props {
  playerPosition: [number, number] | null;
}

export default function GoinsLayer({ playerPosition }: Props) {
  const { coins, removeCoin } = useCoins();
  const visibleCoins = filterVisibleCoins(
    coins,
    playerPosition,
    PLAYER_VISIBLE_RADIUS
  );

  return (
    <>
      {visibleCoins.map((goin) => (
        <Marker key={goin.id} position={[goin.lat, goin.lng]} icon={coinIcon}>
          <Popup>
            <PopupGodsend
              id={goin.id}
              description={goin.description}
              image={goin.image}
              onTake={removeCoin}
              name={goin.name}
              weight={goin.weight}
              value={goin.value}
            />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
