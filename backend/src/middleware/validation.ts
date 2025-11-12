import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from '../utils/response';

/**
 * Middleware to check validation results
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendValidationError(res, errors.array());
    return;
  }
  next();
};

/**
 * Validation rules for user signup
 */
export const signupValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate,
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Validation rules for creating a snippet
 */
export const createSnippetValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('code')
    .notEmpty()
    .withMessage('Code content is required'),
  body('language')
    .trim()
    .notEmpty()
    .withMessage('Language is required'),
  body('visibility')
    .optional()
    .isIn(['PUBLIC', 'PRIVATE'])
    .withMessage('Visibility must be either PUBLIC or PRIVATE'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  validate,
];

/**
 * Validation rules for updating a snippet
 */
export const updateSnippetValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('code')
    .optional()
    .notEmpty()
    .withMessage('Code content cannot be empty'),
  body('language')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Language cannot be empty'),
  body('visibility')
    .optional()
    .isIn(['PUBLIC', 'PRIVATE'])
    .withMessage('Visibility must be either PUBLIC or PRIVATE'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  validate,
];

/**
 * Validation rules for creating a comment
 */
export const createCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  validate,
];

/**
 * Validation rules for UUID parameters
 */
export const uuidParamValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate,
];

/**
 * Validation rules for pagination query parameters
 */
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate,
];
