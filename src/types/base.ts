export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Состояние игрока
export interface Player {
  id: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  gold: number;
}

// Базовый интерфейс для квеста
export interface BaseQuest {
  id: string;
  title: string;
  description: string;
  reward: {
    gold: number;
    experience: number;
  };
  isCompleted: boolean;
}

// Типы квестов можно будет расширить позже
export type Quest = BaseQuest;
