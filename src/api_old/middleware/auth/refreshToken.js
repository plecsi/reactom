import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret';
const JWT_REFRESH_SECRET = 'your_jwt_refresh_secret';

const RefreshTokenMW = (objRepo) => {
  return async function RefreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ error: 'Refresh token required' });

    try {
      // Megkeressük a usert, akinek van ilyen refresh tokenje
      const user = await objRepo.user.findOne({ refreshTokens: refreshToken }).exec();

      if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

      // Ellenőrizzük a refresh token érvényességét
      jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      // Új access token generálása
      const newAccessToken = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken: newAccessToken });
    } catch (err) {
      console.error('Refresh token error:', err);
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  };
};

export default RefreshTokenMW;
