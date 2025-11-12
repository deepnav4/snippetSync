import api from './axios';
import type { Snippet, CreateSnippetData, UpdateSnippetData, Comment } from './types';

export const snippetService = {
  async getAllPublic(): Promise<{ snippets: Snippet[], pagination: any }> {
    const response = await api.get('/snippets/public');
    return response.data.data;
  },

  async getMySnippets(): Promise<Snippet[]> {
    const response = await api.get('/snippets/my');
    return response.data.data;
  },

  async getById(id: string): Promise<Snippet> {
    const response = await api.get(`/snippets/${id}`);
    return response.data.data;
  },

  async getByShareSlug(slug: string): Promise<Snippet> {
    const response = await api.get(`/snippets/import/${slug}`);
    return response.data.data;
  },

  async create(data: CreateSnippetData): Promise<Snippet> {
    const response = await api.post('/snippets', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateSnippetData): Promise<Snippet> {
    const response = await api.put(`/snippets/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/snippets/${id}`);
  },

  async toggleUpvote(id: string): Promise<{ upvoted: boolean }> {
    const response = await api.post(`/snippets/${id}/upvote`);
    return response.data.data;
  },

  async checkUpvote(id: string): Promise<{ upvoted: boolean }> {
    const response = await api.get(`/snippets/${id}/upvote/check`);
    return response.data.data;
  },

  async getComments(id: string): Promise<Comment[]> {
    const response = await api.get(`/snippets/${id}/comments`);
    return response.data.data;
  },

  async addComment(snippetId: string, content: string): Promise<Comment> {
    const response = await api.post(`/snippets/${snippetId}/comments`, { content });
    return response.data.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/snippets/comments/${commentId}`);
  },
};
