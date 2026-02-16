import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:3000';

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

export const questsApi = {
  async getQuests(playerId?: string): Promise<Quest[]> {
    const params = playerId ? { playerId } : {};
    const response = await axios.get(`${API_BASE_URL}/quests`, { params });
    return response.data;
  },

  async createQuest(
    title: string,
    description: string,
    playerId?: string
  ): Promise<Quest> {
    const response = await axios.post(`${API_BASE_URL}/quests`, {
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
    const response = await axios.put(`${API_BASE_URL}/quests/${id}/status`, {
      status,
    });
    return response.data;
  },

  async updateQuestProgress(
    id: string,
    visitedPointIds: string[]
  ): Promise<Quest> {
    const response = await axios.put(`${API_BASE_URL}/quests/${id}/progress`, {
      visitedPointIds,
    });
    return response.data;
  },

  async deleteQuest(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/quests/${id}`);
  },
};
