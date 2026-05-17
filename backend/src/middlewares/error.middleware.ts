import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { sendFailure } from '../utils/ApiResponse';
import { env } from '../config/env';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // next is required so Express recognizes this as an error handler
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    // Handle mongoose specific errors
    const e = err as Error & { code?: number; name?: string; keyValue?: unknown };
    if (e.name === 'ValidationError') {
      statusCode = 400;
      message = e.message;
    } else if (e.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid identifier provided';
    } else if (e.code === 11000) {
      statusCode = 409;
      message = 'Duplicate value';
      details = e.keyValue;
    } else {
      message = e.message;
    }
  }

  if (env.nodeEnv !== 'production') {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  sendFailure(res, message, statusCode, details);
};
