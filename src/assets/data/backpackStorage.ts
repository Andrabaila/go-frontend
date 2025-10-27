import type { BackpackItem } from '@/types';

const STORAGE_KEY = 'backpack';

export function getBackpack(): BackpackItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToBackpack(item: Omit<BackpackItem, 'quantity'>) {
  const backpack = getBackpack();

  // ищем по имени, а не по id
  const existing = backpack.find((i) => i.name === item.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    backpack.push({ ...item, quantity: 1 });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(backpack));
}

export function removeFromBackpack(itemName: string) {
  const backpack = getBackpack()
    .map((i) => {
      if (i.name === itemName) {
        // уменьшаем количество, если больше 1
        return i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : null;
      }
      return i;
    })
    .filter(Boolean); // удаляем null, если вещь кончилась

  localStorage.setItem(STORAGE_KEY, JSON.stringify(backpack));
}
