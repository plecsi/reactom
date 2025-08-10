import updateMw from '../middleware/auth/updateUser.js';
import loadUserProfileMW from '../middleware/user/loadUserProfile.js';
import { csrfProtection } from '../middleware/auth/csrf.js';

export default function userRoutes(app, objRepo) {
  app.post('/api/user/update', csrfProtection, updateMw(objRepo));
  app.get('/api/user', csrfProtection, loadUserProfileMW(objRepo));
}
