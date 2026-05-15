export interface BackpackItem {
  id: string;
  name: string;
  description?: string;
}

export const backpackItems: BackpackItem[] = [
  { id: '1', name: 'Ancient Coin', description: 'Rare coin' },
  { id: '2', name: 'Health Potion', description: 'Restores 50 HP' },
];
