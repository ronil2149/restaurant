const express = require('express');

const IngredientController = require('../controllers/ingredients');

const router = express.Router();


router.post('/addingredient', IngredientController.createIngredient);

router.get('/getIngredients',IngredientController.getIngredients);

router.get('/getIngredient/:ingredientId',IngredientController.getIngredient);

// router.put('/update/:ingredientId')

module.exports = router; 