const express = require('express');

const orderController = require('../controllers/order');
const auth = require('../middleware/is-auth');

const router = express.Router();


router.put('/makeorder',auth.auth,orderController.add);

router.put('/parcelorder',auth.auth,orderController.add);

router.post('/waiter/makeorder',orderController.WaiterOrder);

router.post('/waiter/addtocart/:product_id/:ingredientId?',orderController.WaiterCart);

router.get('/tableorder',orderController.OrderListByTable);

router.get('/getorder/:orderId',orderController.getOrder);

router.get('/getorders',orderController.getOrders);

router.get('/bycatid/:orderId',auth.auth,orderController.FindByCateId);

router.put('/acceptbycatid/:orderId/:itemId',auth.auth,orderController.AcceptByItemId);

router.put('/donebycatid/:orderId/:itemId',auth.auth,orderController.DoneByItemId);

router.put('/cancelbycatid/:orderId/:itemId',auth.auth,orderController.CancelByItemId);

router.put('/tokitchen/:orderId/:itemId',orderController.SentToKitchen);

router.post('/coupon',orderController.CouponGenerate);

router.get('/myorders',auth.auth,orderController.GetMyOrders);

router.post('/current',auth.auth,orderController.GetMyCurrentOrders);

router.put('/receive/:orderId',orderController.receiveOrder);

router.put('/list',orderController.PreparedOrderList);

router.put('/cancel/:orderId',orderController.cancelOrder);

router.get('/howlong/:orderId',orderController.TimeItTook);

router.get('/timeforitem/:orderId/:itemId',orderController.TimeForItem);

router.put('/done/:orderId',orderController.DoneOrder);

router.delete('/delete',auth.auth,orderController.DeleteOrder);

router.put('/setdiscount/:orderId',orderController.setDiscount);

router.put('/serve/:orderId',orderController.ServeOrder);

module.exports = router;