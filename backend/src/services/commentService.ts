import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCommentData {
  content: string;
  snippetId: string;
  authorId: string;
}

/**
 * Create a comment on a snippet
 */
export const createComment = async (data: CreateCommentData) => {
  const { content, snippetId, authorId } = data;

  // Check if snippet exists
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  // Create comment
  const comment = await prisma.comment.create({
    data: {
      content,
      snippetId,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  });

  return comment;
};

/**
 * Get all comments for a snippet
 */
export const getSnippetComments = async (snippetId: string) => {
  const comments = await prisma.comment.findMany({
    where: { snippetId },
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
    },
  });

  return comments;
};

/**
 * Delete a comment
 */
export const deleteComment = async (
  commentId: string,
  userId: string
): Promise<void> => {
  // Check if comment exists and user is the author
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.authorId !== userId) {
    throw new Error('Access denied');
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
};

/**
 * Update a comment
 */
export const updateComment = async (
  commentId: string,
  userId: string,
  content: string
) => {
  // Check if comment exists and user is the author
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.authorId !== userId) {
    throw new Error('Access denied');
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  });

  return updatedComment;
};
