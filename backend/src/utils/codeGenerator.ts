import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate a random 6-character alphanumeric code
 * Format: lowercase letters and numbers only (e.g., "a7k9m2", "x3p5q8")
 */
export const generateCode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
};

/**
 * Generate a unique 6-character code that doesn't exist in the database
 * Retries up to 10 times if collision occurs
 */
export const generateUniqueCode = async (): Promise<string> => {
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateCode();
    
    // Check if code already exists
    const existing = await prisma.shareCode.findUnique({
      where: { code },
    });
    
    if (!existing) {
      return code;
    }
  }
  
  throw new Error('Failed to generate unique code after multiple attempts');
};

/**
 * Clean up expired share codes from the database
 * This can be run periodically to remove expired codes
 */
export const cleanupExpiredCodes = async (): Promise<number> => {
  const result = await prisma.shareCode.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  
  return result.count;
};
