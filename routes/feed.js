const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/menu', feedController.getMenu);

// POST /feed/post
router.post('/product', feedController.createProduct);

router.get('/product/:productId',feedController.getProduct);

router.put('/product/:productId',feedController.updateProduct);

router.delete('/product/:productId',feedController.deleteProduct);


module.exports = router; 