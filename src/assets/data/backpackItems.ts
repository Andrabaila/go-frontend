export interface BackpackItem {
  id: string;
  name: string;
  description?: string;
}

export const backpackItems: BackpackItem[] = [
  { id: '1', name: 'Старинная монета', description: 'Редкая монета' },
  { id: '2', name: 'Зелье здоровья', description: 'Восстанавливает 50 HP' },
];
