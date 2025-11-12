import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Toggle upvote on a snippet
 * If user already upvoted, remove the upvote. Otherwise, add an upvote.
 */
export const toggleUpvote = async (snippetId: string, userId: string) => {
  // Check if snippet exists
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  // Check if user already upvoted
  const existingUpvote = await prisma.upvote.findUnique({
    where: {
      snippetId_userId: {
        snippetId,
        userId,
      },
    },
  });

  if (existingUpvote) {
    // Remove upvote
    await prisma.upvote.delete({
      where: { id: existingUpvote.id },
    });

    // Decrement upvotes count
    await prisma.snippet.update({
      where: { id: snippetId },
      data: {
        upvotesCount: {
          decrement: 1,
        },
      },
    });

    return { upvoted: false, message: 'Upvote removed' };
  } else {
    // Add upvote
    await prisma.upvote.create({
      data: {
        snippetId,
        userId,
      },
    });

    // Increment upvotes count
    await prisma.snippet.update({
      where: { id: snippetId },
      data: {
        upvotesCount: {
          increment: 1,
        },
      },
    });

    return { upvoted: true, message: 'Upvote added' };
  }
};

/**
 * Check if user has upvoted a snippet
 */
export const hasUserUpvoted = async (
  snippetId: string,
  userId: string
): Promise<boolean> => {
  const upvote = await prisma.upvote.findUnique({
    where: {
      snippetId_userId: {
        snippetId,
        userId,
      },
    },
  });

  return !!upvote;
};

/**
 * Get upvote count for a snippet
 */
export const getUpvoteCount = async (snippetId: string): Promise<number> => {
  return await prisma.upvote.count({
    where: { snippetId },
  });
};
