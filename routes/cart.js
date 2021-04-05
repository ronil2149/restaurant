const express = require('express');

const cartController = require('../controllers/cart');

const router = express.Router();


router.post('/addtocart/:productId',cartController.add);

router.get('/getcart',cartController.get);

router.put('/subtract/:productId',cartController.subtract);

router.post('/emptycart',cartController.remove);

router.get('/invoice/:cartId',cartController.getInvoice);
module.exports = router; 