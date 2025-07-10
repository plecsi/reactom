import db from '../config/db.js';

const settingsModel = db.model('settings', {
    valami: String
});

export  default settingsModel
