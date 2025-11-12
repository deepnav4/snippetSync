export interface Snippet {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  shareSlug: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  accessToken: string;
}

export interface CreateSnippetData {
  title: string;
  description?: string;
  code: string;
  language: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  tags?: string[];
}
