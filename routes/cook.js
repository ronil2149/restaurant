const express = require('express');
const router = express.Router();

const auth = require('../middleware/is-auth');

const cookController = require('../controllers/cook');

router.put('/addcook',cookController.addCook);
router.post('/login',cookController.cooklogin);
router.get('/getcooks',cookController.getCooks);
router.get('/getcook/:cookId',cookController.getCook);
router.post('/forgot',cookController.cookforgot);
router.post('/reset',cookController.cookreset);


module.exports = router;