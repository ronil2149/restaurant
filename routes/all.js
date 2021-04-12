const express = require('express');
const router = express.Router();

const allController = require('../controllers/all');
const auth = require('../middleware/is-auth');

router.put('/register',allController.signup);

router.post('/login',allController.login);

router.post('/forgot',allController.forgot);

router.get('/get',allController.getSomeone);

router.post('/reset',allController.reset);

router.post('/role',auth.auth,allController.UpdateRole);

module.exports = router;