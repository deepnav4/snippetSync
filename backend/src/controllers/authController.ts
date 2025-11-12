import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Register a new user
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const tokens = await authService.registerUser({ username, email, password });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, { accessToken: tokens.accessToken }, 'User registered successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.loginUser({ email, password });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, { accessToken: tokens.accessToken }, 'Login successful');
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      sendError(res, 'Refresh token not provided', 401);
      return;
    }

    const accessToken = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, { accessToken }, 'Token refreshed successfully');
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }

    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Logout successful');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user!.userId;
    const profile = await authService.getUserProfile(userId);
    sendSuccess(res, profile);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};
