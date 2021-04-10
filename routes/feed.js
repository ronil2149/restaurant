const express = require('express');

const feedController = require('../controllers/feed');
const auth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/getposts',auth.auth, feedController.getProducts);

// POST /feed/post
router.post('/create', feedController.createProduct);

router.put('/itemunavailable/:productId',feedController.UnavailableItem);

router.put('/itemavailable/:productId',feedController.ItemAvailable);

router.get('/getmenu',auth.auth,feedController.getMenu);

router.get('/product/:productId',feedController.getProduct);

router.put('/product/:productId',feedController.updateProduct);

router.delete('/product/:productId',feedController.deleteProduct);

module.exports = router; 