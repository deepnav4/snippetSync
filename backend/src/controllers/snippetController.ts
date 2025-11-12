import { Request, Response } from 'express';
import * as snippetService from '../services/snippetService';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Create a new snippet
 */
export const createSnippet = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user!.userId;
    const { title, description, language, code, visibility } = req.body;

    const snippet = await snippetService.createSnippet({
      title,
      description,
      language,
      code,
      visibility: visibility || 'PUBLIC',
      authorId: userId,
    });

    sendSuccess(res, snippet, 'Snippet created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

/**
 * Get all public snippets
 */
export const getPublicSnippets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, language, search, order } = req.query;

    const result = await snippetService.getPublicSnippets({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      language: language as string,
      search: search as string,
      order: order as 'asc' | 'desc',
    });

    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

/**
 * Get snippet by ID
 */
export const getSnippetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const snippet = await snippetService.getSnippetById(id, userId);
    sendSuccess(res, snippet);
  } catch (error: any) {
    const statusCode = error.message === 'Snippet not found' ? 404 : 403;
    sendError(res, error.message, statusCode);
  }
};

/**
 * Get snippet by share slug (for importing to VS Code)
 */
export const getSnippetByShareSlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const snippet = await snippetService.getSnippetByShareSlug(slug);
    sendSuccess(res, snippet);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

/**
 * Update snippet
 */
export const updateSnippet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user!.userId;
    const { title, description, language, code, visibility } = req.body;

    const snippet = await snippetService.updateSnippet(id, userId, {
      title,
      description,
      language,
      code,
      visibility,
    });

    sendSuccess(res, snippet, 'Snippet updated successfully');
  } catch (error: any) {
    const statusCode = error.message === 'Snippet not found' ? 404 : 403;
    sendError(res, error.message, statusCode);
  }
};

/**
 * Delete snippet
 */
export const deleteSnippet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user!.userId;

    await snippetService.deleteSnippet(id, userId);
    sendSuccess(res, null, 'Snippet deleted successfully');
  } catch (error: any) {
    const statusCode = error.message === 'Snippet not found' ? 404 : 403;
    sendError(res, error.message, statusCode);
  }
};

/**
 * Get user's snippets
 */
export const getUserSnippets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const requesterId = (req as any).user?.userId;

    const snippets = await snippetService.getUserSnippets(userId, requesterId);
    sendSuccess(res, snippets);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

/**
 * Get current user's snippets
 */
export const getMySnippets = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user!.userId;
    const snippets = await snippetService.getUserSnippets(userId, userId);
    sendSuccess(res, snippets);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
