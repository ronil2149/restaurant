const Ingredient = require('../models/ingredients');

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
  };
  
exports.createIngredient = (req,res,next) =>{
    const IngredientName = req.body.IngredientName;
    const description = req.body.description;
    const imageUrl = req.file.path;
    const price = req.body.price;
    let creator;
    const ingredient = new Ingredient({
      IngredientName: IngredientName,
      imageUrl: `http://192.168.0.5:8080/${imageUrl}`,
      price:price,
      description: description,
      creator: {name:'Manager'}
    });
    Ingredient.findOne({IngredientName:IngredientName})
    .then(ingredient=>{
        if(ingredient){
            return res.json({message:'Ingredients already available'});
        }
        else if(!ingredient){
            ingredient.save()
            return res.status(201).json({message: 'Ingredient added to cart successfully!', product: ingredient });
        }
    })
      .catch(err => {
        if (!err.statusCode) {       
          err.statusCode = 500;
        }
        next(err);
      });
  
};



exports.getIngredients = (req, res, next) => {
    const CurrentPage = req.query.page || 1;
    const perPage = 20;
    let totalItems;
    Ingredient.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Ingredient.find()
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(ingredients => {
        res.status(200)
          .json({
            message: 'Fetched ingredients Successfully',
            ingredients: ingredients,
            totalItems: totalItems
          });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });  
  };


  
exports.getIngredient = (req, res, next) => {
    const ingredientId = req.params.ingredientId;
    Ingredient.findById(ingredientId)
      .then(ingredient => {
        if (!ingredient) {
          const error = new Error('Could not find ingredient.');
          error.statusCode = 404;
          return res.json({message:'could not find it'})
        }
        return res.status(200).json({ message: 'ingredient fetched.', ingredient: ingredient });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };