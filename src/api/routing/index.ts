import authController from '../controllers/auth.controller.ts';
import userController from '../controllers/user.controller.ts';

export default function Routings(app) {
  app.use('/auth', authController);
  app.use('/user', userController);
};
