import bcrypt from 'bcrypt';
import User from '../models/user';
import { IUser } from '../types/User';

export const createUser = async (email: string, password: string): Promise<IUser> => {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = new User({ email, passwordHash, twoFactorEnabled: false });
  return user.save();
};

export const findUserByEmail = (email: string) => User.findOne({ email }).exec();

export const findUserById = (id: string) => User.findById(id).exec();

export const verifyPassword = async (user: IUser, password: string): Promise<boolean> =>
  bcrypt.compare(password, user.passwordHash);

export const setTwoFactor = async (userId: string, enabled: boolean, secret?: string) => {
  const update: Partial<IUser> = { twoFactorEnabled: enabled };
  if (secret) update.twoFactorSecret = secret;
  return User.findByIdAndUpdate(userId, update, { new: true }).exec();
};
