import express from 'express';
import { findUserById, setTwoFactor } from '../services/user.service';
import { requireAuth } from '../middleware/auth/auth.middleware';

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });
  const u = await findUserById(userId);
  if (!u) return res.status(404).json({ message: 'No user' });
  res.json({ id: u.id, email: u.email, twoFactorEnabled: u.twoFactorEnabled });
});

router.put('/profile', requireAuth, async (req, res) => {
  const userId = req.body.userId as string;
  const { twoFactorEnabled } = req.body;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });
  const u = await setTwoFactor(userId, !!twoFactorEnabled);
  res.json({ id: u!.id, email: u!.email, twoFactorEnabled: u!.twoFactorEnabled });
});

export default router;
