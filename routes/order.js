const express = require('express');

const orderController = require('../controllers/order');

const router = express.Router();


router.put('/makeorder',orderController.add);

router.get('/getorder/:orderId',orderController.getOrder);

router.get('/getorders',orderController.getOrders);

router.put('/receive/:orderId',orderController.receiveOrder);

router.get('/list',orderController.PreparedOrderList);

router.put('/cancel/:orderId',orderController.cancelOrder);


router.put('/done/:orderId',orderController.DoneOrder);

router.delete('/delete',orderController.DeleteOrder);

module.exports = router;