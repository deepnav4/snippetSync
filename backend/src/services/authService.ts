import { PrismaClient } from '@prisma/client';
import { SignupData, LoginData, TokenPair, JWTPayload } from '../types';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokenPair } from '../utils/jwt';

const prisma = new PrismaClient();

/**
 * Register a new user
 */
export const registerUser = async (data: SignupData): Promise<TokenPair> => {
  const { username, email, password } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email already registered');
    }
    throw new Error('Username already taken');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  // Generate tokens
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
  };
  const tokens = generateTokenPair(payload);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return tokens;
};

/**
 * Login user
 */
export const loginUser = async (data: LoginData): Promise<TokenPair> => {
  const { email, password } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
  };
  const tokens = generateTokenPair(payload);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return tokens;
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  // Find refresh token in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error('Invalid refresh token');
  }

  // Check if token is expired
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });
    throw new Error('Refresh token expired');
  }

  // Generate new access token
  const payload: JWTPayload = {
    userId: storedToken.user.id,
    email: storedToken.user.email,
  };
  const { generateAccessToken } = await import('../utils/jwt');
  return generateAccessToken(payload);
};

/**
 * Logout user (delete refresh token)
 */
export const logoutUser = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      profilePicture: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          snippets: true,
          comments: true,
          upvotes: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
