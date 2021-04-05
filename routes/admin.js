const express = require('express');
const router = express.Router();


const adminController = require('../controllers/admin');

router.put('/addadmin',adminController.addAdmin);
router.post('/login',adminController.adminlogin);
// router.post('/protected',auth.auth,authController.protected);
// router.post('/renewAccess',authController.refresh);

router.post('/forgot',adminController.Adminforgot);

router.post('/reset',adminController.adminreset);
module.exports = router;