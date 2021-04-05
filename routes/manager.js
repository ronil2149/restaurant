const express = require('express');
const router = express.Router();


const manageController = require('../controllers/manager');

router.put('/addmanager',manageController.addManager);
router.post('/login',manageController.managerlogin);
router.get('/getmanagers',manageController.getManagers);
router.get('/getmanager/:managerId',manageController.getManager);
router.post('/forgot',manageController.managerforgot);
router.post('/reset',manageController.managerreset);
module.exports = router;