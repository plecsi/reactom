import bcrypt from 'bcrypt';
import User from '../models/User.ts';
import type { IUser } from '../types.ts';

export const createUser = async (username: string, password: string): Promise<IUser> => {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = new User({ username, passwordHash, is2FAEnabled: false });
  return user.save();
};

export const findUserByEmail = (username: string) => User.findOne({ username }).exec();

export const findUserById = (_id: string) => User.findById(_id).exec();

export const verifyPassword = async (user: IUser, password: string): Promise<boolean> =>
  bcrypt.compare(password, user.passwordHash);

export const setTwoFactor = async (userId: string, enabled: boolean, secret?: string) => {
  const update: Partial<IUser> = { is2FAEnabled: enabled };
  if (secret) update.totpSecret = secret;
  return User.findByIdAndUpdate(userId, update, { new: true }).exec();
};
