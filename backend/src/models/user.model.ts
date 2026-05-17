import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { UserRole } from '../types';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  return next();
});

userSchema.methods.comparePassword = async function compare(
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.findByEmail = function findByEmail(email: string) {
  return this.findOne({
    email: email.toLowerCase().trim(),
  }).select('+password');
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.password = undefined;
    ret.__v = undefined;

    return ret;
  },
});

export const UserModel = model<IUserDocument, IUserModel>(
  'User',
  userSchema
);