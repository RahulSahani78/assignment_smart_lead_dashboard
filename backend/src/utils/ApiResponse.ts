import type { Response } from 'express';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200,
  meta?: Record<string, unknown>
): Response<ApiSuccess<T>> => {
  const payload: ApiSuccess<T> = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

export const sendFailure = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown
): Response<ApiFailure> => {
  return res.status(statusCode).json({ success: false, message, errors });
};
