import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'your_jwt_secret';
const JWT_REFRESH_SECRET = 'your_jwt_refresh_secret';

const LoginMW = (objRepo) => {
  return async function Login(req, res, next) {
    const { username, password } = req.body;
    const userModel = objRepo.user;

    try {
      // Egyetlen user lekérése a username alapján
      const user = await userModel.findOne({ username: username.trim().toLowerCase() }).exec();
      if (!user) return res.status(401).json({ error: 'username Invalid credentials' });
      // Jelszó ellenőrzése
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: 'password Invalid credentials' });

      // 2FA ellenőrzés
      if (user.is2FAEnabled) {
        const tempToken = jwt.sign(
          { id: user._id, username: user.username },
          JWT_SECRET,
          { expiresIn: '5m' }
        );
        return res.json({ requires2FA: true, tempToken });
      }

      // Access és refresh token generálás
      const accessToken = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Refresh token mentése
      user.refreshTokens = user.refreshTokens || [];
      user.refreshTokens.push(refreshToken);
      await user.save();

      // Válasz küldése
      res.json({
        requires2FA: false,
        accessToken,
        refreshToken,
        user: { id: user._id, username: user.username },
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export default LoginMW;
