/**
 * Validates and normalizes Indian phone numbers.
 * Allowed formats:
 * - 10 digits starting with 6, 7, 8, or 9
 * - Leading 0 (11 digits total)
 * - Leading +91 or 91 (12-13 characters)
 * Returns normalized 10-digit format (e.g. "9876543210") or null if invalid.
 */
export function validateAndNormalizeIndianPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, normalized: '', error: 'Phone number is required' };
  }

  // Remove spaces, hyphens, parentheses, and leading '+'
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');

  let tenDigits = '';
  if (cleaned.length === 10) {
    tenDigits = cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    tenDigits = cleaned.slice(1);
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    tenDigits = cleaned.slice(2);
  } else {
    return { isValid: false, normalized: '', error: 'Invalid Indian phone number length' };
  }

  // Must begin with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(tenDigits)) {
    return { 
      isValid: false, 
      normalized: '', 
      error: 'Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9' 
    };
  }

  return { isValid: true, normalized: tenDigits };
}
