import { Document } from 'mongoose';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string; // base32 secret for TOTP
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}