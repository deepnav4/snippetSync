import { Request, Response } from 'express';
import * as snippetService from '../services/snippetService';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Create a new snippet with temporary share code
 */
export const createSnippet = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user!.userId;
    const { title, description, language, code, visibility } = req.body;

    const result = await snippetService.createSnippet({
      title,
      description,
      language,
      code,
      visibility: visibility || 'PUBLIC',
      authorId: userId,
    });

    // Return snippet with share code and expiration
    sendSuccess(res, {
      snippet: result.snippet,
      shareCode: result.shareCode.code,
      expiresAt: result.shareCode.expiresAt,
    }, 'Snippet created successfully', 201);
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

    // Transform shareCodes to shareCode for all snippets
    const transformedResult = {
      ...result,
      snippets: result.snippets.map(snippet => {
        const transformed = {
          ...snippet,
          shareCode: (snippet as any).shareCodes || [],
        };
        delete (transformed as any).shareCodes;
        return transformed;
      }),
    };

    sendSuccess(res, transformedResult);
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
    
    // Transform shareCodes (plural from DB) to shareCode (singular for frontend)
    const transformedSnippet = {
      ...snippet,
      shareCode: (snippet as any).shareCodes || [],
    };
    delete (transformedSnippet as any).shareCodes;
    
    sendSuccess(res, transformedSnippet);
  } catch (error: any) {
    const statusCode = error.message === 'Snippet not found' ? 404 : 403;
    sendError(res, error.message, statusCode);
  }
};

/**
 * Get snippet by temporary share code (for importing to VS Code)
 */
export const getSnippetByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const snippet = await snippetService.getSnippetByCode(code);
    sendSuccess(res, snippet);
  } catch (error: any) {
    const statusCode = error.message === 'Share code has expired' ? 410 : 404;
    sendError(res, error.message, statusCode);
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
 * Generate a new temporary share code for a snippet
 * Public endpoint - anyone can generate a code for any snippet
 */
export const generateShareCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await snippetService.generateShareCode(id);
    sendSuccess(res, result, 'Share code generated successfully');
  } catch (error: any) {
    const statusCode = error.message === 'Snippet not found' ? 404 : 400;
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
