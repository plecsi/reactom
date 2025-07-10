import db from '../config/db.js';

const userModel = db.model('users', {
  users: Object,
});

export default userModel;
