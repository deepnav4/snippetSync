import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get user profile with detailed statistics
 */
export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      profilePicture: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          snippets: true,
          comments: true,
          upvotes: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Get user statistics including language breakdown and total upvotes received
 */
export const getUserStats = async (userId: string) => {
  // Get total upvotes received on user's snippets
  const upvotesReceived = await prisma.upvote.count({
    where: {
      snippet: {
        authorId: userId,
      },
    },
  });

  // Get language breakdown with snippet counts
  const languageStats = await prisma.snippet.groupBy({
    by: ['language'],
    where: {
      authorId: userId,
    },
    _count: {
      language: true,
    },
    orderBy: {
      _count: {
        language: 'desc',
      },
    },
  });

  // Get recent snippets
  const recentSnippets = await prisma.snippet.findMany({
    where: {
      authorId: userId,
      visibility: 'PUBLIC',
    },
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Get most upvoted snippets
  const topSnippets = await prisma.snippet.findMany({
    where: {
      authorId: userId,
      visibility: 'PUBLIC',
    },
    take: 5,
    orderBy: {
      upvotesCount: 'desc',
    },
    include: {
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    upvotesReceived,
    languageStats: languageStats.map(stat => ({
      language: stat.language,
      count: stat._count.language,
    })),
    recentSnippets,
    topSnippets,
  };
};

/**
 * Get user by username (for public profile viewing)
 */
export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      profilePicture: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          snippets: true,
          comments: true,
          upvotes: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  data: {
    bio?: string;
    profilePicture?: string;
  }
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      bio: data.bio,
      profilePicture: data.profilePicture,
    },
    select: {
      id: true,
      username: true,
      email: true,
      profilePicture: true,
      bio: true,
      createdAt: true,
    },
  });

  return user;
};
