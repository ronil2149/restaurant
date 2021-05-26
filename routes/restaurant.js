const express = require('express');
const router = express.Router();

const RestaurantController = require('../controllers/restaurant');

router.post('/addresto',RestaurantController.MakeRestaurant);

router.put('/deactivate/:restaurantId',RestaurantController.Deactivate);

router.put('/activate/:restaurantId',RestaurantController.Activate);

router.delete('/delete/:restaurantId',RestaurantController.Delete);

router.get('/remainedtime/:restaurantId',RestaurantController.RemainingTime);

router.put('/getrestaurants',RestaurantController.GetRestaurants);

router.get('/totalrestaurants',RestaurantController.TotalRestaurants);

router.get('/time/:restaurantId',RestaurantController.TimeItTook);

router.put('/pending/:restaurantId',RestaurantController.PaymentPending);

router.put('/paymentdone/:restaurantId',RestaurantController.paymentDone);

router.post('/makepayment/:restaurantId',RestaurantController.MakePayment);

router.get('/history/:restaurantId',RestaurantController.ViewHistory);
module.exports = router;