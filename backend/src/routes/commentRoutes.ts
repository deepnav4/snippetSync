import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import { authenticate } from '../middleware/auth';
import { createCommentValidation, uuidParamValidation } from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/snippets/:id/comments
 * @desc    Get all comments for a snippet
 * @access  Public
 */
router.get('/:id/comments', uuidParamValidation, commentController.getSnippetComments);

/**
 * @route   POST /api/snippets/:id/comments
 * @desc    Create a comment on a snippet
 * @access  Private
 */
router.post('/:id/comments', authenticate, uuidParamValidation, createCommentValidation, commentController.createComment);

/**
 * @route   PUT /api/comments/:commentId
 * @desc    Update a comment
 * @access  Private (author only)
 */
router.put('/comments/:commentId', authenticate, uuidParamValidation, createCommentValidation, commentController.updateComment);

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete a comment
 * @access  Private (author only)
 */
router.delete('/comments/:commentId', authenticate, uuidParamValidation, commentController.deleteComment);

export default router;
