import { PrismaClient } from '@prisma/client';
import { SnippetFilters } from '../types';
import { generateUniqueCode } from '../utils/codeGenerator';

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
 * Create a new snippet with temporary 6-digit share code
 */
export const createSnippet = async (data: CreateSnippetData) => {
  // Generate a unique 6-digit code
  const code = await generateUniqueCode();
  
  // Set expiration to 5 minutes from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  
  const snippet = await prisma.snippet.create({
    data: {
      title: data.title,
      description: data.description,
      language: data.language,
      code: data.code,
      visibility: data.visibility,
      authorId: data.authorId,
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

  // Create the temporary share code
  const shareCode = await prisma.shareCode.create({
    data: {
      code,
      snippetId: snippet.id,
      expiresAt,
    },
  });

  return { 
    snippet, 
    shareCode: { 
      code: shareCode.code, 
      expiresAt: shareCode.expiresAt 
    } 
  };
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
        shareCodes: {
          where: {
            expiresAt: {
              gt: new Date(), // Only include non-expired codes
            },
          },
          select: {
            code: true,
            expiresAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Get the most recent valid code
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
      shareCodes: {
        where: {
          expiresAt: {
            gt: new Date(), // Only include non-expired codes
          },
        },
        select: {
          code: true,
          expiresAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1, // Get the most recent valid code
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
 * Get snippet by temporary share code (for VS Code import)
 * Validates that the code hasn't expired
 */
export const getSnippetByCode = async (code: string) => {
  // Find the share code
  const shareCode = await prisma.shareCode.findUnique({
    where: { code },
    include: {
      snippet: {
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
      },
    },
  });

  if (!shareCode) {
    throw new Error('Share code not found');
  }

  // Check if code has expired
  if (shareCode.expiresAt < new Date()) {
    // Delete the expired code
    await prisma.shareCode.delete({
      where: { id: shareCode.id },
    });
    throw new Error('Share code has expired');
  }

  return shareCode.snippet;
};

/**
 * Generate a new temporary share code for an existing snippet
 * Anyone can generate a code for any snippet (public access)
 */
export const generateShareCode = async (snippetId: string) => {
  // Check if snippet exists
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  // Generate a unique 6-digit code
  const code = await generateUniqueCode();
  
  // Set expiration to 5 minutes from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Create the temporary share code
  const shareCode = await prisma.shareCode.create({
    data: {
      code,
      snippetId: snippet.id,
      expiresAt,
    },
  });

  return {
    code: shareCode.code,
    expiresAt: shareCode.expiresAt,
  };
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
      shareCodes: {
        where: {
          expiresAt: {
            gt: new Date(), // Only include non-expired codes
          },
        },
        select: {
          code: true,
          expiresAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1, // Get the most recent valid code
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
