const express = require('express');

const orderController = require('../controllers/order');
const auth = require('../middleware/is-auth');

const router = express.Router();


router.put('/makeorder',auth.auth,orderController.add);

router.get('/getorder/:orderId',orderController.getOrder);

router.get('/getorders',orderController.getOrders);

router.get('/bycatid/:orderId/:categoryId',orderController.FindByCateId);

router.get('/myorders',auth.auth,orderController.GetMyOrders);

router.post('/current',auth.auth,orderController.GetMyCurrentOrders);

router.put('/receive/:orderId',orderController.receiveOrder);

router.put('/list',orderController.PreparedOrderList);

router.put('/cancel/:orderId',orderController.cancelOrder);

router.get('/howlong/:orderId',orderController.TimeItTook);

router.put('/done/:orderId',orderController.DoneOrder);

router.delete('/delete',auth.auth,orderController.DeleteOrder);

router.put('/setdiscount/:orderId',orderController.setDiscount);

router.put('/serve/:orderId',orderController.ServeOrder);

module.exports = router;