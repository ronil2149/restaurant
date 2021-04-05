const express = require('express');

const orderController = require('../controllers/order');

const router = express.Router();


router.put('/makeorder',orderController.add);

module.exports = router;