import { UserModel, type IUserDocument } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import type { AuthPayload, UserRole } from '../types';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

const toAuthPayload = (user: IUserDocument): AuthPayload => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  role: user.role,
});

const toAuthResponse = (user: IUserDocument): AuthResponse => ({
  token: signToken(toAuthPayload(user)),
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  },
});

export const registerUser = async (
  input: RegisterInput
): Promise<AuthResponse> => {
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }
  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role ?? 'sales',
  });
  return toAuthResponse(user);
};

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await UserModel.findByEmail(input.email);
  if (!user) throw ApiError.unauthorized('Invalid credentials');
  const ok = await user.comparePassword(input.password);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');
  return toAuthResponse(user);
};

export const getProfile = async (userId: string): Promise<IUserDocument> => {
  const user = await UserModel.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};
