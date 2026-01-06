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
    <div className="absolute left-[70px] top-10 z-[2000] rounded-lg bg-gray-500 p-5 shadow-md">
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
