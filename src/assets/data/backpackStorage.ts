export interface BackpackItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
}

const STORAGE_KEY = 'backpack';

export function getBackpack(): BackpackItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToBackpack(item: Omit<BackpackItem, 'quantity'>) {
  const backpack = getBackpack();
  const existing = backpack.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    backpack.push({ ...item, quantity: 1 });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(backpack));
}

export function removeFromBackpack(itemId: string) {
  const backpack = getBackpack().filter((i) => i.id !== itemId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(backpack));
}
