const express = require('express');

const IngredientController = require('../controllers/ingredients');

const router = express.Router();

router.post('/addingredient/', IngredientController.createIngredient);

router.post('/inginproduct/:productId/:ingredientId',IngredientController.AddingIngredientIntoProduct);

router.post('/ingoutproduct/:productId/:ingredientId',IngredientController.RemovingIngredientFromProduct);

router.get('/getIngredients',IngredientController.getIngredients);

router.get('/getIngredient/:ingredientId',IngredientController.getIngredient);

router.put('/update/:ingredientId',IngredientController.updateIngredient);

router.delete('/delete/:ingredientId',IngredientController.deleteIngredient);

module.exports = router; 