import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../services/token.service';

// Middleware to check accessToken and CSRF token
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return res.status(401).json({ message: 'No access token' });

    const csrfHeader = req.headers['x-csrf-token'];
    if (!csrfHeader || typeof csrfHeader !== 'string') {
      return res.status(403).json({ message: 'Missing CSRF token' });
    }

    // In real production: match csrfHeader with value stored server-side or in JWT claims
    verifyAccessToken(accessToken);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid access token' });
  }
};
