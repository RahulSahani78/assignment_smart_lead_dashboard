import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import { env } from '../config/env';
import type { AuthPayload } from '../types';

export const signToken = (payload: AuthPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.jwtSecret as Secret, options);
};

export const verifyToken = (token: string): AuthPayload => {
  const decoded = jwt.verify(token, env.jwtSecret as Secret);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return decoded as unknown as AuthPayload;
};
