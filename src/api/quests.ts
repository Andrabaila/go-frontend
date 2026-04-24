import { apiClient } from '@/api/client';

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  playerId?: string;
  objectives?: {
    type: 'visit_points';
    requiredCount: number;
    radiusMeters: number;
    points: {
      id: string;
      label?: string;
      lat?: number;
      lng?: number;
    }[];
  };
  progress?: {
    visitedPointIds?: string[];
  };
  reward?: {
    gold?: number;
    item?: string;
  };
}

export interface QuestShowcaseItem {
  id: string;
  duration: number;
  distance: number;
  difficulty: number;
  price: number;
  is_active: boolean;
  title?: string;
  district?: string;
  city?: string;
  description?: string;
}

export const questsApi = {
  async getQuests(playerId?: string): Promise<Quest[]> {
    const params = playerId ? { playerId } : {};
    const response = await apiClient.get('/quests', { params });
    return response.data;
  },

  async getShowcaseQuests(lang = 'ru'): Promise<QuestShowcaseItem[]> {
    const response = await apiClient.get('/admin/api/quests', {
      params: { lang },
    });
    return response.data;
  },

  async createQuest(
    title: string,
    description: string,
    playerId?: string
  ): Promise<Quest> {
    const response = await apiClient.post('/quests', {
      title,
      description,
      playerId,
    });
    return response.data;
  },

  async updateQuestStatus(
    id: string,
    status: 'active' | 'completed' | 'pending'
  ): Promise<Quest> {
    const response = await apiClient.put(`/quests/${id}/status`, {
      status,
    });
    return response.data;
  },

  async updateQuestProgress(
    id: string,
    visitedPointIds: string[]
  ): Promise<Quest> {
    const response = await apiClient.put(`/quests/${id}/progress`, {
      visitedPointIds,
    });
    return response.data;
  },

  async deleteQuest(id: string): Promise<void> {
    await apiClient.delete(`/quests/${id}`);
  },
};
