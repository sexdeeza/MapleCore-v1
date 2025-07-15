// src/lib/security/password.ts
// Secure password hashing using bcrypt

import bcrypt from 'bcryptjs';

// Configuration
const SALT_ROUNDS = 12; // Good balance of security and performance

/**
 * Hash a password securely
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string, 
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Check if a password hash needs to be upgraded
 * (useful when migrating from weaker hashing)
 */
export function needsRehash(hash: string): boolean {
  try {
    const rounds = bcrypt.getRounds(hash);
    return rounds < SALT_ROUNDS;
  } catch {
    // Not a bcrypt hash - definitely needs rehashing
    return true;
  }
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  
  return token;
}

/**
 * Password strength checker
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length < 8) feedback.push('Use at least 8 characters');

  // Character variety
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Include special characters');

  // Common patterns to avoid
  if (/(.)\1{2,}/.test(password)) {
    score--;
    feedback.push('Avoid repeated characters');
  }

  if (/^[0-9]+$/.test(password)) {
    score--;
    feedback.push('Don\'t use only numbers');
  }

  // Common passwords check (basic)
  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome',
    'monkey', '1234567890', 'password1', 'qwerty123'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    score = 0;
    feedback.unshift('This password is too common');
  }

  return {
    score: Math.max(0, Math.min(5, score)),
    feedback
  };
}

// ==========================================
// JWT TOKEN SECURITY
// ==========================================

import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
  username: string;
  isAdmin?: boolean;
}

// Get JWT secret with validation
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  return secret;
}

/**
 * Generate a secure JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '24h',      // Token expires in 24 hours
    issuer: 'maplekaede',  // Identify your tokens
    algorithm: 'HS256'     // Secure algorithm
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      issuer: 'maplekaede',
      algorithms: ['HS256']
    }) as TokenPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Generate a refresh token (longer lived)
 */
export function generateRefreshToken(userId: number): string {
  return jwt.sign(
    { userId, type: 'refresh' }, 
    getJwtSecret(), 
    { expiresIn: '7d' }
  );
}

// ==========================================
// MIGRATION HELPER FOR OLD PASSWORDS
// ==========================================

/**
 * Check if password is using old/weak hashing
 * MapleStory private servers often use SHA1 or MD5
 */
export async function migratePasswordIfNeeded(
  userId: number,
  plainPassword: string,
  currentHash: string,
  updatePasswordFn: (userId: number, newHash: string) => Promise<void>
): Promise<boolean> {
  // Check if it's already bcrypt
  if (currentHash.startsWith('$2a$') || currentHash.startsWith('$2b$')) {
    return verifyPassword(plainPassword, currentHash);
  }

  // Handle common MapleStory password formats
  let isValid = false;

  // SHA1 (40 chars)
  if (currentHash.length === 40) {
    const crypto = require('crypto');
    const sha1Hash = crypto.createHash('sha1').update(plainPassword).digest('hex');
    isValid = sha1Hash === currentHash;
  }
  
  // MD5 (32 chars)
  else if (currentHash.length === 32) {
    const crypto = require('crypto');
    const md5Hash = crypto.createHash('md5').update(plainPassword).digest('hex');
    isValid = md5Hash === currentHash;
  }

  // If old password is valid, upgrade to bcrypt
  if (isValid) {
    const newHash = await hashPassword(plainPassword);
    await updatePasswordFn(userId, newHash);
    console.log(`Upgraded password hash for user ${userId} from legacy to bcrypt`);
  }

  return isValid;
}