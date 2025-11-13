import api from './axios';

export interface Notification {
  id: string;
  type: 'upvote' | 'comment' | 'follow' | 'share';
  userId: string;
  actorUsername: string;
  snippetId: string | null;
  snippetTitle: string | null;
  message: string;
  createdAt: string;
  read: boolean;
}

const notificationService = {
  async getAll(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  },
};

export default notificationService;
