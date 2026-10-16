import { describe, it, expect } from 'vitest';
import { validateAndNormalizeIndianPhone } from '../utils/phoneValidator.js';
import { generateBookingReference } from '../utils/referenceGenerator.js';

describe('Phone Number Validation & Normalization', () => {
  it('should validate and normalize standard 10-digit Indian numbers starting with 6, 7, 8, or 9', () => {
    expect(validateAndNormalizeIndianPhone('9876543210')).toEqual({
      isValid: true,
      normalized: '9876543210',
    });
    expect(validateAndNormalizeIndianPhone('6386463054')).toEqual({
      isValid: true,
      normalized: '6386463054',
    });
    expect(validateAndNormalizeIndianPhone('7005536781')).toEqual({
      isValid: true,
      normalized: '7005536781',
    });
    expect(validateAndNormalizeIndianPhone('8123456789')).toEqual({
      isValid: true,
      normalized: '8123456789',
    });
  });

  it('should handle numbers with +91 country prefix', () => {
    expect(validateAndNormalizeIndianPhone('+919876543210')).toEqual({
      isValid: true,
      normalized: '9876543210',
    });
    expect(validateAndNormalizeIndianPhone('+91 6386463054')).toEqual({
      isValid: true,
      normalized: '6386463054',
    });
  });

  it('should handle numbers with leading 0', () => {
    expect(validateAndNormalizeIndianPhone('09876543210')).toEqual({
      isValid: true,
      normalized: '9876543210',
    });
  });

  it('should reject invalid numbers', () => {
    // Starts with 5 (invalid in India)
    expect(validateAndNormalizeIndianPhone('5551234567').isValid).toBe(false);
    // Too short
    expect(validateAndNormalizeIndianPhone('98765').isValid).toBe(false);
    // Too long
    expect(validateAndNormalizeIndianPhone('98765432101234').isValid).toBe(false);
    // Non-numeric
    expect(validateAndNormalizeIndianPhone('abcdefghij').isValid).toBe(false);
    // Empty
    expect(validateAndNormalizeIndianPhone('').isValid).toBe(false);
  });
});

describe('Booking Reference Generator', () => {
  it('should generate valid format BAC-YYYYMMDD-XXXXXX', () => {
    const testDate = new Date('2025-08-15T10:00:00Z');
    const ref = generateBookingReference(testDate);
    expect(ref).toMatch(/^BAC-20250815-[0-9A-F]{6}$/);
  });

  it('should generate distinct non-guessable references across calls', () => {
    const ref1 = generateBookingReference();
    const ref2 = generateBookingReference();
    expect(ref1).not.toBe(ref2);
  });
});
