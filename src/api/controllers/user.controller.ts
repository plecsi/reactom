import express from 'express';
import { findUserById, setTwoFactor } from '../services/user.service.ts';
import { requireAuth } from '../middleware/auth.middleware.ts';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
  const userId = req.user?.id; // requireAuth-ban beállítva
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  const u = await findUserById(userId);
  if (!u) return res.status(404).json({ message: 'No user' });

  res.json({ id: u.id, name: u.username, is2FAEnabled: u.is2FAEnabled });
});

router.get('/profile/:userId', requireAuth, async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  const u = await findUserById(userId);
  let qrCode: string | null = null;

  if (u.is2FAEnabled && u.totpSecret) {
    const otpauthUrl = speakeasy.otpauthURL({
      secret: u.totpSecret,
      label: `MyApp (${u.username})`,
      issuer: 'MyApp',
    });
    qrCode = await qrcode.toDataURL(otpauthUrl);
  }

  if (!u) return res.status(404).json({ message: 'No user' });
  res.json({ id: u.id, name: u.username, is2FAEnabled: u.is2FAEnabled, qrCode });
});


router.put('/profile/:userId', requireAuth, async (req, res) => {
  const { userId, is2FAEnabled } = req.body;
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const u = await setTwoFactor(userId, !!is2FAEnabled);
  let qrCode = null;

  if (is2FAEnabled) {
    if (!u.totpSecret) {
      const secret = speakeasy.generateSecret({
        name: `MyApp (${u.username})`,
        length: 32
      });
      u.totpSecret = secret.base32;
    }
    u.is2FAEnabled = true;
    await u.save(); // 💾 Titok mentése

    const otpauthUrl = speakeasy.otpauthURL({
      secret: u.totpSecret,
      label: `MyApp (${u.username})`,
      issuer: 'MyApp',
      encoding: 'base32'
    });

    qrCode = await qrcode.toDataURL(otpauthUrl);

  } else {
    // Kikapcsolás
    u.is2FAEnabled = false;
    u.totpSecret = null;
    await u.save();
  }

  res.json({
    id: u.id,
    name: u.username,
    is2FAEnabled: u.is2FAEnabled,
    qrCode
  });
});



router.get('/profile/:userId/2fa/qrcode', requireAuth, async (req, res) => {
  const { userId } = req.params;
  const u = await User.findById(userId);

  if (!u || !u.is2FAEnabled || !u.totpSecret) {
    return res.status(404).json({ message: '2FA not enabled' });
  }

  const otpauthUrl = speakeasy.otpauthURL({
    secret: u.totpSecret,
    label: `MyApp (${u.username})`,
    issuer: 'MyApp',
  });

  const qrCode = await qrcode.toDataURL(otpauthUrl);
  res.json({ qrCode });
});

export default router;
