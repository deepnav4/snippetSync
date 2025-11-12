import { Request, Response } from 'express';
import * as upvoteService from '../services/upvoteService';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Toggle upvote on a snippet
 */
export const toggleUpvote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user!.userId;

    const result = await upvoteService.toggleUpvote(id, userId);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

/**
 * Check if user has upvoted a snippet
 */
export const checkUpvote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user!.userId;

    const hasUpvoted = await upvoteService.hasUserUpvoted(id, userId);
    sendSuccess(res, { hasUpvoted });
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
