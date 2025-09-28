// src/components/ui/Button.tsx
// 📘 Заглушечный UI-компонент

interface PlaceholderProps {
  /** Текст, который будет отображён внутри компонента */
  text?: string;
  /** Дополнительный CSS-класс для кастомизации */
  className?: string;
}

/**
 * Заглушечный компонент, который можно использовать как временный
 * визуальный элемент до реализации полноценного компонента.
 */
export default function Button({
  text = 'Placeholder',
  className = '',
}: PlaceholderProps) {
  return (
    <div
      className={`bg-gray-200 border border-gray-400 rounded p-4 text-center ${className}`}
    >
      {text}
    </div>
  );
}
