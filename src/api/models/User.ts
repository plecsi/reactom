import { Schema } from 'mongoose';
import db from '../config/db.ts';
import type { IUser } from '../types.ts';

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  is2FAEnabled: { type: Boolean, default: false },
  totpSecret: { type: String }
});

export default db.model<IUser>('users', UserSchema);
