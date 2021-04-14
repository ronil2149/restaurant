const express = require('express');

const orderController = require('../controllers/order');
const auth = require('../middleware/is-auth');

const router = express.Router();


router.put('/makeorder',auth.auth,orderController.add);

router.get('/getorder/:orderId',orderController.getOrder);

router.get('/getorders',orderController.getOrders);

router.put('/receive/:orderId',orderController.receiveOrder);

router.get('/list',orderController.PreparedOrderList);

router.put('/cancel/:orderId',orderController.cancelOrder);


router.put('/done/:orderId',orderController.DoneOrder);

router.delete('/delete',orderController.DeleteOrder);

router.put('/setdiscount/:orderId',orderController.setDiscount);

module.exports = router;