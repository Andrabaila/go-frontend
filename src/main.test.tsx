import { describe, it, expect, vi } from 'vitest';

// 🔹 Моки создаём внутри vi.hoisted() — безопасно при подъёме vi.mock
const { mockRender, mockCreateRoot } = vi.hoisted(() => {
  const mockRender = vi.fn();
  const mockCreateRoot = vi.fn(() => ({ render: mockRender }));
  return { mockRender, mockCreateRoot };
});

// 🔹 Мокаем react-dom/client
vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

describe('main.tsx', () => {
  it('calls createRoot and render with App inside StrictMode', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    // Динамический импорт main.tsx, чтобы код выполнился
    await import('@/main');

    // Проверяем вызовы моков
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('throws an error if root element is missing', async () => {
    document.body.innerHTML = ''; // нет #root

    // 🔹 Сбрасываем кэш модулей перед повторным импортом
    vi.resetModules();

    try {
      await import('@/main'); // снова выполняем main.tsx
      throw new Error('Expected an error but none was thrown');
    } catch (error) {
      // Проверяем сообщение ошибки
      expect((error as Error).message).toBe('Root element not found');
    }
  });
});
