// src/components/map/ObjectFilterPanel.tsx

interface ObjectFilterPanelProps {
  availableTypes: string[];
  selectedTypes: string[];
  onToggle: (type: string) => void;
}

export default function ObjectFilterPanel({
  availableTypes,
  selectedTypes,
  onToggle,
}: ObjectFilterPanelProps) {
  return (
    <div className="absolute top-10 left-[70px] z-[2000] bg-gray-500 p-5 rounded-lg shadow-md">
      {availableTypes.map((type) => (
        <div key={type}>
          <label>
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => onToggle(type)}
            />
            {` ${type.charAt(0).toUpperCase()}${type.slice(1)}`}
          </label>
        </div>
      ))}
    </div>
  );
}
