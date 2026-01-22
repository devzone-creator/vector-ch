import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * Generate anonymous ID for reports
 * Format: anon_<8-char-hash>
 */
export const generateAnonymousId = (): string => {
  const randomBytes = crypto.randomBytes(4);
  const hash = randomBytes.toString('hex');
  return `anon_${hash}`;
};

/**
 * Hash IP address for rate limiting without storing actual IP
 */
export const hashIP = (ip: string): string => {
  return crypto.createHash('sha256').update(ip + process.env.JWT_SECRET).digest('hex');
};

/**
 * Generate secure random password for demo police accounts
 */
export const generateSecurePassword = (): string => {
  return crypto.randomBytes(8).toString('hex');
};