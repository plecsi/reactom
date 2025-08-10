import db from '../config/db.js';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: false },
  passwordHash: { type: String, required: false },
  totpSecret: { type: String, required: false },
  is2FAEnabled: { type: Boolean, default: false },
  refreshTokens: { type: [String], default: [] },
});

const userModel = db.model('users', UserSchema);

export default userModel;