// backend/src/middleware/csrfMiddleware.ts
import crypto from 'crypto';
import { Request, Response} from 'express';

export function generateCsrfToken() {
  return crypto.randomBytes(24).toString('hex');
}

export function csrfTokenSetter(req: Request, res: Response, next) {
  // Ha nincs csrfToken cookie, generálunk és beállítjuk
  if (!req.cookies.csrfToken) {
    const token = generateCsrfToken();
    res.cookie('csrfToken', token, {
      httpOnly: false, // hogy frontend elérje
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
  next();
}

export function csrfProtection(req, res, next) {
  // Csak az érzékeny műveletekhez
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const csrfCookie = req.cookies.csrfToken;
    const csrfHeader = req.get('X-CSRF-Token');
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }
  }
  next();
}
