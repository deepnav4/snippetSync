import { Router } from 'express';
import * as snippetController from '../controllers/snippetController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import {
  createSnippetValidation,
  updateSnippetValidation,
  uuidParamValidation,
  paginationValidation,
} from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/snippets/public
 * @desc    Get all public snippets
 * @access  Public
 */
router.get('/public', paginationValidation, snippetController.getPublicSnippets);

/**
 * @route   GET /api/snippets/my
 * @desc    Get current user's snippets
 * @access  Private
 */
router.get('/my', authenticate, snippetController.getMySnippets);

/**
 * @route   GET /api/snippets/import/:slug
 * @desc    Get snippet by share slug (for VS Code extension)
 * @access  Public
 */
router.get('/import/:slug', snippetController.getSnippetByShareSlug);

/**
 * @route   POST /api/snippets
 * @desc    Create a new snippet
 * @access  Private
 */
router.post('/', authenticate, createSnippetValidation, snippetController.createSnippet);

/**
 * @route   GET /api/snippets/:id
 * @desc    Get snippet by ID
 * @access  Public (with optional auth for private snippets)
 */
router.get('/:id', uuidParamValidation, optionalAuthenticate, snippetController.getSnippetById);

/**
 * @route   PUT /api/snippets/:id
 * @desc    Update a snippet
 * @access  Private (author only)
 */
router.put('/:id', authenticate, uuidParamValidation, updateSnippetValidation, snippetController.updateSnippet);

/**
 * @route   DELETE /api/snippets/:id
 * @desc    Delete a snippet
 * @access  Private (author only)
 */
router.delete('/:id', authenticate, uuidParamValidation, snippetController.deleteSnippet);

/**
 * @route   GET /api/snippets/user/:userId
 * @desc    Get user's snippets
 * @access  Public (shows only public snippets unless requester is the author)
 */
router.get('/user/:userId', uuidParamValidation, optionalAuthenticate, snippetController.getUserSnippets);

export default router;
