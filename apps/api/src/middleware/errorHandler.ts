import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR');
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred. Please try again later.'
    : err.message || 'An error occurred';

  if (statusCode === 500) {
    console.error(`[Error] ${req.method} ${req.path}:`, err);
  }

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message,
      ...(process.env.NODE_ENV !== 'production' && err.details ? { details: err.details } : {}),
    },
  });
}
