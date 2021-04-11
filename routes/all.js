const express = require('express');
const router = express.Router();

const allController = require('../controllers/all');

router.put('/register',allController.signup);

router.post('/login',allController.login);

router.post('/forgot',allController.forgot);

module.exports = router;