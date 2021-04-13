const express = require('express');
const router = express.Router();

const allController = require('../controllers/all');
const auth = require('../middleware/is-auth');

router.put('/register',allController.signup);

router.post('/login',allController.login);

router.post('/forgot',auth.auth,allController.forgot);

router.get('/get',allController.getSomeone);

router.post('/reset',allController.reset);

router.put('/updaterole',auth.auth,allController.UpdateRole);

router.put('/switchrole',auth.auth,allController.SwitchRole);

module.exports = router;