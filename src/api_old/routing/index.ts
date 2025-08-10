import loadDatasMW from '../middleware/loadDatas.js';
import loadUserMW from '../middleware/loadUsers.js';

import loadFormBuilderMw from '../middleware/formBuilder/loadFormBuilder.js';
import saveFormMw from '../middleware/formBuilder/saveForm.js';
import updateFormMw from '../middleware/formBuilder/updateForm.js';
import deleteFormMw from '../middleware/formBuilder/deleteForm.js';

import renderMw from '../middleware/render';
//import SettingsModel from '../models/settings';
import FormBuilderModel from '../models/formBuilder';
import UserModel from '../models/user';

import authRoutes from './authRoute';
import userRoutes from './userRoute';

function subscribeToRouter(app: any) {
  const objRepo = {
    //entityData: SettingsModel,
    formBuilderData: FormBuilderModel,
    user: UserModel,
  };

  authRoutes(app, objRepo);
  userRoutes(app, objRepo)





  app.use('/api/data', loadDatasMW(objRepo), renderMw(objRepo, 'DATAS'));
  app.get('/api/users', loadUserMW(objRepo), renderMw(objRepo, 'USERS'));

  //FORMBUILDER
  app.get(
    '/api/form-builder',
    loadFormBuilderMw(objRepo),
    renderMw(objRepo, 'FORMS')
  );

  app.post(
    '/api/form-builder/add',
    saveFormMw(objRepo),
    renderMw(objRepo, 'FORMBUILDER')
  );
  app.post(
    '/api/form-builder/:id',
    updateFormMw(objRepo),
    renderMw(objRepo, 'FORMBUILDER')
  );
  app.delete(
    '/api/form-builder/:id',
    deleteFormMw(objRepo),
    renderMw(objRepo, 'FORMBUILDER')
  );
}

export default subscribeToRouter;
