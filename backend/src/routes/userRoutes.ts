import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected routes - require authentication
router.get('/profile', authenticate, userController.getCurrentUserProfile);
router.get('/stats', authenticate, userController.getUserStatistics);
router.put('/profile', authenticate, userController.updateProfile);

// Public routes - view other users' profiles
router.get('/:username', userController.getPublicUserProfile);
router.get('/:username/stats', userController.getPublicUserStatistics);

export default router;
