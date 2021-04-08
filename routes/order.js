const express = require('express');

const orderController = require('../controllers/order');

const router = express.Router();


router.put('/makeorder',orderController.add);

router.get('/getorder/:orderId',orderController.getOrder);

router.get('/getorders',orderController.getOrders);

router.get('/receive/:orderId',orderController.receiveOrder);

router.get('/list',orderController.PreparedOrderList);

router.get('/cancel/:orderId',orderController.cancelOrder);

router.put('/done/:orderId',orderController.DoneOrder);

router.delete('/delete',orderController.DeleteOrder);

module.exports = router;