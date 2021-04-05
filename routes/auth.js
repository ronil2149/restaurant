const express = require('express');
const router = express.Router();
const Yup = require("yup-phone");


const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');
const auth = require('../middleware/is-auth');

router.put('/register',authController.signup);
         
router.post('/login',authController.login);
router.post('/protected',auth.auth,authController.protected);
router.post('/renewAccess',authController.refresh);

router.post('/forgot',authController.forgotPw);

router.post('/reset',authController.resetPw);

router.post('/feedback/:userId',authController.feedback);
module.exports = router;