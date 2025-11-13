import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Get current user profile with basic info and counts
 */
export const getCurrentUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user!.userId;
    const user = await userService.getUserProfile(userId);
    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

/**
 * Get detailed user statistics
 */
export const getUserStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user!.userId;
    const stats = await userService.getUserStats(userId);
    sendSuccess(res, stats);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

/**
 * Get public user profile by username
 */
export const getPublicUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

/**
 * Get public user statistics by username
 */
export const getPublicUserStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    const stats = await userService.getUserStats(user.id);
    sendSuccess(res, stats);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

/**
 * Update current user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user!.userId;
    const { bio, profilePicture } = req.body;

    const user = await userService.updateUserProfile(userId, {
      bio,
      profilePicture,
    });

    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
