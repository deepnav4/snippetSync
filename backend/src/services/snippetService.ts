import { PrismaClient } from '@prisma/client';
import { SnippetFilters } from '../types';

const prisma = new PrismaClient();

export interface CreateSnippetData {
  title: string;
  description?: string;
  language: string;
  code: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  authorId: string;
}

export interface UpdateSnippetData {
  title?: string;
  description?: string;
  language?: string;
  code?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
}

/**
 * Create a new snippet
 */
export const createSnippet = async (data: CreateSnippetData) => {
  // Generate a unique share slug
  const shareSlug = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  
  const snippet = await prisma.snippet.create({
    data: {
      title: data.title,
      description: data.description,
      language: data.language,
      code: data.code,
      visibility: data.visibility,
      authorId: data.authorId,
      shareSlug,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
      _count: {
        select: {
          comments: true,
          upvotes: true,
        },
      },
    },
  });

  return snippet;
};

/**
 * Get all public snippets with pagination
 */
export const getPublicSnippets = async (filters: SnippetFilters) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {
    visibility: 'PUBLIC',
  };

  if (filters.language) {
    where.language = filters.language;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const [snippets, total] = await Promise.all([
    prisma.snippet.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: filters.order === 'asc' ? 'asc' : 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            upvotes: true,
          },
        },
      },
    }),
    prisma.snippet.count({ where }),
  ]);

  return {
    snippets,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get snippet by ID (checks visibility and permissions)
 */
export const getSnippetById = async (
  snippetId: string,
  userId?: string
) => {
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
          bio: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          upvotes: true,
        },
      },
    },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  // Check if user can access private snippet
  if (snippet.visibility === 'PRIVATE' && snippet.authorId !== userId) {
    throw new Error('Access denied');
  }

  return snippet;
};

/**
 * Get snippet by share slug (for private snippets)
 */
export const getSnippetByShareSlug = async (shareSlug: string) => {
  const snippet = await prisma.snippet.findUnique({
    where: { shareSlug },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          upvotes: true,
        },
      },
    },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  return snippet;
};

/**
 * Update snippet
 */
export const updateSnippet = async (
  snippetId: string,
  userId: string,
  data: UpdateSnippetData
) => {
  // Check ownership
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  if (snippet.authorId !== userId) {
    throw new Error('Access denied');
  }

  // Update snippet
  const updatedSnippet = await prisma.snippet.update({
    where: { id: snippetId },
    data,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
      _count: {
        select: {
          comments: true,
          upvotes: true,
        },
      },
    },
  });

  return updatedSnippet;
};

/**
 * Delete snippet
 */
export const deleteSnippet = async (
  snippetId: string,
  userId: string
): Promise<void> => {
  // Check ownership
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  if (snippet.authorId !== userId) {
    throw new Error('Access denied');
  }

  await prisma.snippet.delete({
    where: { id: snippetId },
  });
};

/**
 * Get user's snippets
 */
export const getUserSnippets = async (
  userId: string,
  requesterId?: string
) => {
  const where: any = {
    authorId: userId,
  };

  // If requester is not the author, only show public snippets
  if (userId !== requesterId) {
    where.visibility = 'PUBLIC';
  }

  const snippets = await prisma.snippet.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
          upvotes: true,
        },
      },
    },
  });

  return snippets;
};
