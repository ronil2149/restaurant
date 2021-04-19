const express = require('express');
const router = express.Router();

const RestaurantController = require('../controllers/restaurant');
router.post('/addresto',RestaurantController.MakeRestaurant);

module.exports = router;