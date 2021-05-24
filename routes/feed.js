const express = require('express');

const feedController = require('../controllers/feed');
const auth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/getposts', feedController.getProducts);

// POST /feed/post
router.post('/create/:categoryId', feedController.createProduct); 

router.put('/itemunavailable/:productId',feedController.UnavailableItem); 

router.put('/itemavailable/:productId',feedController.ItemAvailable); 

router.put('/unavailable/:productId',feedController.ItemUnavailable); 

router.post('/getmenu',feedController.getMenu); 

router.get('/product/:productId',feedController.getProduct); 

router.put('/update/:productId',feedController.updateProduct);

router.put('/outdate/:productId',feedController.Outdated);

router.delete('/delete/:productId',feedController.deleteProduct);

router.get('/menu/:categoryId',feedController.getMenuByCategoryId);

router.post('/offer',feedController.AllRestaurantOffer);


module.exports = router; 