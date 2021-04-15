const express = require('express');

const cartController = require('../controllers/cart');
const auth = require('../middleware/is-auth');

const router = express.Router();

// router.post('/addtocart/:productId',auth.auth,cartController.addToCart);

router.post('/addincart/:product_id',auth.auth,cartController.add);

router.get('/getcart',auth.auth,cartController.get);

router.put('/subtract/:productId',auth.auth,cartController.subtract);

router.delete('/emptycart',auth.auth,cartController.remove);

router.get('/invoice/:cartId',cartController.getInvoice);

module.exports = router; 