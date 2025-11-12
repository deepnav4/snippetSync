import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Create a comment on a snippet
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user!.userId;
    const { content } = req.body;

    const comment = await commentService.createComment({
      content,
      snippetId: id,
      authorId: userId,
    });

    sendSuccess(res, comment, 'Comment created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

/**
 * Get all comments for a snippet
 */
export const getSnippetComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const comments = await commentService.getSnippetComments(id);
    sendSuccess(res, comments);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user!.userId;

    await commentService.deleteComment(commentId, userId);
    sendSuccess(res, null, 'Comment deleted successfully');
  } catch (error: any) {
    const statusCode = error.message === 'Comment not found' ? 404 : 403;
    sendError(res, error.message, statusCode);
  }
};

/**
 * Update a comment
 */
export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user!.userId;
    const { content } = req.body;

    const comment = await commentService.updateComment(commentId, userId, content);
    sendSuccess(res, comment, 'Comment updated successfully');
  } catch (error: any) {
    const statusCode = error.message === 'Comment not found' ? 404 : 403;
    sendError(res, error.message, statusCode);
  }
};
