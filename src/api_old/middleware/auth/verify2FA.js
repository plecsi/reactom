// 2FA ellenőrzés middleware
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

const JWT_SECRET = 'your_jwt_secret';
const JWT_REFRESH_SECRET = 'your_jwt_refresh_secret';

const Verify2FAMW = (objRepo) => {
  return async function Verify2FA(req, res) {
    const { tempToken, code } = req.body;
    const userModel = objRepo.user;
    try {
      const payload = jwt.verify(tempToken, JWT_SECRET);
      const user = await userModel.findById(payload.id).exec();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.is2FAEnabled) {
        return res.status(400).json({ error: '2FA not enabled for user' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: code,
        window: 1,
      });

      console.log('Expected secret:', user.totpSecret);
      console.log('Received code:', code);
      console.log('Is verified:', verified);

      if (!verified) return res.status(401).json({ error: 'Invalid 2FA code' });

      // 2FA sikeres, generálunk access és refresh tokent
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });
      user.refreshTokens.push(refreshToken);
      user.save()

      res.json({
        accessToken,
        refreshToken,
        user: { id: user.id, username: user.username,is2FAEnabled: user.is2FAEnabled },
      });
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};

export default Verify2FAMW;
