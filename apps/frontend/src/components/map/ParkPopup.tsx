import type { FC } from 'react';
type Park = {
  id: number | string;
  name: string;
  isArea?: boolean;
};
interface ParkPopupProps {
  park: Park;
}

const ParkPopup: FC<ParkPopupProps> = ({ park }) => {
  return (
    <div style={{ minWidth: 150 }}>
      <h3 style={{ margin: 0, fontSize: '1rem' }}>{park.name}</h3>
      <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
        🏞️ OSM ID: {park.id} {park.isArea ? '(area)' : '(point)'}
      </p>
      {/* Дополнительно можно добавить кнопки, ссылки, info */}
    </div>
  );
};

export default ParkPopup;
