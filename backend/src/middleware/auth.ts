import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { sendError } from '../utils/response';

/**
 * Middleware to authenticate requests using JWT
 * Verifies the access token and attaches user info to the request
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but doesn't fail if no token is provided
 */
export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const payload = verifyAccessToken(token);
      (req as any).user = payload;
    }
    next();
  } catch (error) {
    // If token is invalid, just continue without user info
    next();
  }
};
