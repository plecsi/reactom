import { GetCsrfTokenMW } from '../middleware/auth/getCsrfToken.js';
import Verify2FAMW from '../middleware/auth/verify2FA.js';
import RefreshTokenMW from '../middleware/auth/refreshToken.js';
import LogoutMW from '../middleware/auth/logout.js';
import LoginMW from '../middleware/auth/login.js';
import { csrfProtection } from '../middleware/auth/csrf.js';
import authController from '../controllers/auth.controller';

export default function authRoutes(app, objRepo) {
/*  //app.get('/api/csrf-token', csrfProtection, GetCsrfTokenMW);
  app.post('/api/login', csrfProtection, LoginMW(objRepo));
  app.post('/api/2fa/verify', csrfProtection, Verify2FAMW(objRepo));
  app.post('/api/token/refresh', csrfProtection, RefreshTokenMW(objRepo));
  app.post('/api/logout', csrfProtection, LogoutMW(objRepo));*/

  app.use('/auth', authController);
}
