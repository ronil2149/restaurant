const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

router.get('/categories',categoryController.getCategories);

router.post('/create',categoryController.createCategory);

router.get('/category/:categoryId',categoryController.getSingle);

router.put('/update/:categoryId',categoryController.updateOne);

router.delete('/deletecat/:categoryId',categoryController.deleteCategorywithProducts);

router.delete('/delete/:categoryId',categoryController.deleteOne);

module.exports = router;