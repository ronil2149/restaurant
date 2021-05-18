const express = require('express');
const router = express.Router();

const couponController = require('../controllers/coupon');

router.post('/generate',couponController.CouponGenerate);

router.put('/match/:orderId',couponController.couponMatch);

router.get('/codes',couponController.getCoupons);

router.get('/code/:couponId',couponController.getCoupon);

router.delete('/delete/:couponId',couponController.DeleteCoupon);

router.put('/update/:couponId',couponController.UpdateCoupon);

module.exports = router;