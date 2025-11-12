import { Router } from 'express';
import * as upvoteController from '../controllers/upvoteController';
import { authenticate } from '../middleware/auth';
import { uuidParamValidation } from '../middleware/validation';

const router = Router();

/**
 * @route   POST /api/snippets/:id/upvote
 * @desc    Toggle upvote on a snippet
 * @access  Private
 */
router.post('/:id/upvote', authenticate, uuidParamValidation, upvoteController.toggleUpvote);

/**
 * @route   GET /api/snippets/:id/upvote/check
 * @desc    Check if user has upvoted a snippet
 * @access  Private
 */
router.get('/:id/upvote/check', authenticate, uuidParamValidation, upvoteController.checkUpvote);

export default router;
