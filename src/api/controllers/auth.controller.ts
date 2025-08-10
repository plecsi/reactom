import express from 'express';
import { findUserByEmail, verifyPassword, setTwoFactor } from '../services/user.service.ts';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../services/token.service.ts';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const setTokenCookies = (res: express.Response, accessToken: string, refreshToken: string) => {
  const secureFlag = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', secure: secureFlag, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure: secureFlag, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const createCsrfToken = () => uuidv4();

router.post('/login', async (req, res) => {
  const { username, password, totp } = req.body;

  const user = await findUserByEmail(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await verifyPassword(user, password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  // Ha 2FA engedélyezve van, de nincs kód -> jelezzük a frontendnek
  if (user.is2FAEnabled && (!totp || totp.trim() === '')) {
    return res.status(206).json({
      twoFactorRequired: true
    });
  }

  // Ha van kód, ellenőrizzük
  if (user.is2FAEnabled && totp && totp.trim() !== '') {
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret || '',
      encoding: 'base32',
      token: totp,
      window: 2
    });
    if (!verified) return res.status(401).json({ message: 'Invalid TOTP' });
  }

  // Tokenek létrehozása
  const accessToken = createAccessToken({ userId: user.id });
  const refreshToken = createRefreshToken({ userId: user.id });
  setTokenCookies(res, accessToken, refreshToken);

  // CSRF token generálása
  const csrfToken = createCsrfToken();

  res.json({
    csrfToken,
    user: {
      id: user.id,
      name: user.username,
      twoFactorEnabled: user.is2FAEnabled
    }
  });
});


router.post('/silent-refresh', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
  try {
    const payload: any = verifyRefreshToken(refreshToken);
    const accessToken = createAccessToken({ userId: payload.userId });
    const newRefreshToken = createRefreshToken({ userId: payload.userId });
    setTokenCookies(res, accessToken, newRefreshToken);
    const csrfToken = createCsrfToken();

    res.json({
      csrfToken,
      user: {
        id: payload.userId,
      }
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ ok: true });
});

router.post('/2fa/setup', async (req, res) => {
  const userId = req.body.userId as string;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  let qrCode = null;


  const secret = speakeasy.generateSecret({ name: `MyApp (${userId})` });
  qrcode.toDataURL(secret.otpauth_url!, (err, dataUrl) => {
    if (err) return res.status(500).json({ message: 'QR generation failed' });
    res.json({ secretBase32: secret.base32, qrDataUrl: dataUrl });
  });
});

router.post('/2fa/verify', async (req, res) => {
  const { userId, secret, token } = req.body;
  if (!userId || !secret || !token) return res.status(400).json({ message: 'Missing' });
  const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
  if (!verified) return res.status(400).json({ message: 'Invalid token' });
  await setTwoFactor(userId, true, secret);
  res.json({ ok: true });
});

export default router;
