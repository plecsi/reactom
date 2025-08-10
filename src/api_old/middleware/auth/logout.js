const LogoutMW = (objRepo) => {
  return async function Logout(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: 'Refresh token required' });

    try {
      const user = await objRepo.user.findOne({ refreshTokens: refreshToken }).exec();
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save();

      res.json({ success: true });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export default LogoutMW;
