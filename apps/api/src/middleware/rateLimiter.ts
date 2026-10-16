import rateLimit from 'express-rate-limit';

/**
 * Standard API rate limiter: 100 requests per 15 minutes per IP
 */
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict limiter for appointment booking: 10 bookings per hour per IP
 */
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    error: {
      code: 'BOOKING_RATE_LIMIT_EXCEEDED',
      message: 'Too many booking attempts. Please wait a while before trying again.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict limiter for status lookups: 20 lookups per 15 minutes per IP
 */
export const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: {
      code: 'LOOKUP_RATE_LIMIT_EXCEEDED',
      message: 'Too many status lookup attempts. Please try again after 15 minutes.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limiter for feedback submission: 5 submissions per hour per IP
 */
export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: {
      code: 'FEEDBACK_RATE_LIMIT_EXCEEDED',
      message: 'Too many feedback submissions. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
