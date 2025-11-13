import api from './axios';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  profilePicture: string | null;
  bio: string | null;
  createdAt: string;
  _count: {
    snippets: number;
    comments: number;
    upvotes: number;
  };
}

export interface LanguageStat {
  language: string;
  count: number;
}

export interface UserStats {
  upvotesReceived: number;
  languageStats: LanguageStat[];
  recentSnippets: any[];
  topSnippets: any[];
}

const userService = {
  // Get current user profile
  async getCurrentProfile(): Promise<UserProfile> {
    const response = await api.get('/users/profile');
    return response.data.data;
  },

  // Get current user statistics
  async getCurrentStats(): Promise<UserStats> {
    const response = await api.get('/users/stats');
    return response.data.data;
  },

  // Get public user profile by username
  async getPublicProfile(username: string): Promise<UserProfile> {
    const response = await api.get(`/users/${username}`);
    return response.data.data;
  },

  // Get public user statistics by username
  async getPublicStats(username: string): Promise<UserStats> {
    const response = await api.get(`/users/${username}/stats`);
    return response.data.data;
  },

  // Update profile
  async updateProfile(data: { bio?: string; profilePicture?: string }): Promise<UserProfile> {
    const response = await api.put('/users/profile', data);
    return response.data.data;
  },
};

export default userService;
