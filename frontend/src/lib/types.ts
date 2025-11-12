export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  _count?: {
    snippets: number;
    comments: number;
  };
}

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
  author: User;
  tags: Tag[];
  _count: {
    upvotes: number;
    comments: number;
  };
  isUpvoted?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  snippetId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: User;
}

export interface Tag {
  id: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface CreateSnippetData {
  title: string;
  description?: string;
  code: string;
  language: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  tags?: string[];
}

export interface UpdateSnippetData extends Partial<CreateSnippetData> {}
