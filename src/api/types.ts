import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  is2FAEnabled: boolean;
  totpSecret?: string;
}
