import loadDatasMW from '../middleware/loadDatas.js';
import loadUserMW from '../middleware/loadUsers.js';
import renderMw from '../middleware/render.js';

import SettingsModel from '../models/settings.js';
import UserModel from '../models/users.js';

function subscribeToRouter(app) {
  const objRepo = {
    entityData: SettingsModel,
    userData:UserModel,
  };
  app.get('/api/data', loadDatasMW(objRepo), renderMw(objRepo, 'DATAS'));
  app.get('/api/users', loadUserMW(objRepo), renderMw(objRepo, 'USERS'));
}

export default subscribeToRouter;
