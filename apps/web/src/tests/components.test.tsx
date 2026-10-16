import { describe, it, expect } from 'vitest';

describe('Frontend Form Validation & Formatting Helpers', () => {
  it('should validate Indian mobile numbers format', () => {
    const indianRegex = /^[6-9]\d{9}$/;
    expect(indianRegex.test('6386463054')).toBe(true);
    expect(indianRegex.test('9005536781')).toBe(true);
    expect(indianRegex.test('1234567890')).toBe(false);
    expect(indianRegex.test('5551234567')).toBe(false);
  });

  it('should validate booking reference format', () => {
    const bookingRefRegex = /^BAC-\d{8}-[0-9A-F]{6}$/;
    expect(bookingRefRegex.test('BAC-20250101-7F3A9C')).toBe(true);
    expect(bookingRefRegex.test('BAC-20251231-A1B2C3')).toBe(true);
    expect(bookingRefRegex.test('INVALID-REF')).toBe(false);
  });

  it('should calculate slot duration time intervals correctly', () => {
    const calculateEndTime = (start: string, durationMinutes: number) => {
      const [sh, sm] = start.split(':').map(Number);
      const total = sh * 60 + sm + durationMinutes;
      const endH = Math.floor(total / 60);
      const endM = total % 60;
      return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    };

    expect(calculateEndTime('09:00', 30)).toBe('09:30');
    expect(calculateEndTime('13:00', 30)).toBe('13:30');
    expect(calculateEndTime('14:30', 25)).toBe('14:55');
  });

  it('should mask phone numbers safely for public status display', () => {
    const maskPhone = (phone: string) => phone.replace(/(\d{6})(\d{4})/, 'XXXXXX$2');
    expect(maskPhone('6386463054')).toBe('XXXXXX3054');
    expect(maskPhone('9005536781')).toBe('XXXXXX6781');
  });
});
