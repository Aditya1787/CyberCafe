import crypto from 'crypto';

/**
 * Generates a unique, non-guessable booking reference.
 * Format: BAC-YYYYMMDD-XXXXXX (e.g. BAC-20250101-7F3A9C)
 */
export function generateBookingReference(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;
  
  // 3 cryptographically secure bytes -> 6 hex characters uppercase
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  return `BAC-${dateStr}-${randomHex}`;
}
