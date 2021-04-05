const express = require('express');
const router = express.Router();


const waiterController = require('../controllers/waiter');

router.put('/addwaiter',waiterController.addWaiter);
router.post('/login',waiterController.waiterlogin);
router.get('/getwaiters',waiterController.getWaiters);
router.get('/getwaiter/:waiterId',waiterController.getWaiter);
router.post('/forgot',waiterController.waiterforgot);
router.post('/reset',waiterController.waiterreset);
module.exports = router;