import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { getProfile, loginUser, registerUser } from '../services/auth.service';
import type { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';
import type {
  LoginInput,
  RegisterInput,
} from '../validators/auth.validator';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body as RegisterInput);
  return sendSuccess(res, result, 'Account created successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body as LoginInput);
  return sendSuccess(res, result, 'Logged in successfully', 200);
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await getProfile(req.user.id);
  return sendSuccess(res, user, 'Profile fetched');
});
