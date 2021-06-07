const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const product = require('../models/product');
const User = require('../models/user');
const  Category = require('../models/category');
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
var CronJob = require('cron').CronJob;
let loadedPrice;

exports.getProducts = (req, res, next) => {
  const CurrentPage = req.query.page || 1;
  const perPage = 10;
  let totalItems;
  Product.find().populate('ingredients').populate('categoryId')
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Product.find().populate('ingredients').populate('categoryId')
        .skip((CurrentPage - 1) * perPage)
        .limit(perPage)
    })
    .then(products => {
      res.status(200)
        .json({
          message: 'Fetched menu Successfully',
          products: products,
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

exports.createProduct = (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  const categoryId = req.params.categoryId;
  const name = req.body.name;
  const description = req.body.description;
  const imageUrl = req.file.path;
  let loadedcategory;
  let loadedName;
  const originalPrice = req.body.originalPrice;

    Category.findById(req.params.categoryId)
    .then(category=>{
      if(!category){
        const error = new Error("product not found")
        throw error;
      }
      loadedName = category.categoryName;
      const product = new Product({
        categoryId : categoryId,
        name:name,
        categoryName : loadedName,
        description:description,
        originalPrice:originalPrice,
        offerPrice:originalPrice,
        imageUrl: `http://192.168.0.4:8080/${imageUrl}`,
      })
      product.save();
      loadedCategory = category
      category.products.push(product)
      return category.save();
    })
    .then(result => {
      res.status(201).json({message: 'Product created successfully!'});
    })
      .catch(err => {
        if (!err.statusCode) {       
          err.statusCode = 500;
        }
        next(err);
      });
};


exports.getProduct =(req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId).populate('ingredients')
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Product fetched.', product: product });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId;
  const offer = req.body.offer;
  const name = req.body.name;
  const description = req.body.description;
  let imageUrl = req.path.imageUrl;
  let loadedOffer;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      const offers = (product.originalPrice* offer)/100 ;
      const LoadedPrices = product.originalPrice - offers;
      product.offerPrice = LoadedPrices;
      product.name = name;
      product.imageUrl = `http://localhost:8080/${imageUrl}`;
      product.offer = offer;
      product.description = description;
      return product.save();
      })
    .then(result => {
      return res.status(200).json({ message: 'Product updated!', post: result ,price:loadedPrice });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.Outdated = (req,res,next) =>{
  const productId = req.params.productId;
  Product.findById(productId)
  .then(product =>{  
    product.offer = 0;
    product.offerPrice = product.originalPrice;
    product.save();
    return res.status(200).json({message:'The offer on this product has been removed',product:product});
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}


exports.UnavailableItem = (req,res,next) =>{
  const productId = req.params.productId;
  let loadedProduct;
  Product.findById(productId)
    .then(product=>{
      if(!product){
        return res.status(404).json({message:'There are no such products'});
      }
      else {
        loadedProduct = product  ;
        loadedProduct.availability = false;
        loadedProduct.save();
        console.log('The process of making an item available has been started....')
        var job = new CronJob('1 * * * * *', function() {
          loadedProduct.availability = true;
          loadedProduct.save();         
          console.log(loadedProduct.availability);
      }, null, true, 'America/Los_Angeles');
      job.start();
      return res.status(200).json({message:"Product is unavailable for the moment can you choose another one", product:product})
    }})
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}


exports.ItemAvailable = (req,res,next) =>{
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product=>{
      if(!product){
        return res.status(404).json({message:'There are no such product'});
      }
      product.availability = true;
      product.save();
      return res.status(200).json({message:'Product is now available'});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.ItemUnavailable =(req,res,next) =>{
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product=>{
      if(!product){
        return res.status(404).json({message:'There are no such product'});
      }
      product.availability = false;
      product.save();
      return res.status(200).json({message:"Product's availability is now set to unavailable"});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}


exports.getMenu = (req,res,next)=>{
  const availability = req.body.availability;
  Product.find({availability})
    .then(products=>{
      if(!products){
        return res.status(404).json({message:'There are no products'})
      }
      return res.status(200).json({message:"Here's the menu you asked for" , menu:products})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      clearImage(product.imageUrl);
      return Product.findByIdAndDelete(productId);
    })
    return Category.findOne(req.params.categoryId)    
    .then(category=>{    
      loadedCategory = category
      category.products.pull(productId); 
      Product.findByIdAndDelete(productId);
      return category.save();
    }) 
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Product deleted!!' ,result: result})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}


exports.getMenuByCategoryId = (req, res, next)=> {
  const categoryId = req.params.categoryId;
  let loadedProduct;
  let loadedcategory;

  Category.findById(categoryId)
  .then(category=>{
    if(!category){
      const error = new Error('There are no such categories!!');
      error.statusCode = 404 ;
      throw error;
    }
    else{
      loadedCategory = category;
      return Product.find({categoryId}).populate('ingredients')
    }
  })
  .then(product => {
    // console.log(product);
    if (product) {
      return res.status(200).json({ message: 'Here is your menu.', products: product , category: loadedCategory});

    }
    else if (product.availability == 'available'){
      return res.status(200).json({ message: 'Here is your menu.', product: product , category: loadedCategory});
    }
    
    })    
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });    
}






exports.AllRestaurantOffer = (req,res,next) =>{
  const offer = req.body.offer;
 
  var loadedProducts =[];
      
  Product.find()
  .then(products =>{
    if(!products)
    {
      const error = new Error('There are no such products!!');
      error.statusCode = 404;
      throw error;
    }
    else{
      loadedProducts = products;
      // console.log(loadedProducts)
      loadedProducts.forEach(product =>{
        product.offer = offer;
        const offers = (product.originalPrice* offer)/100 ;
        const LoadedPrices = product.originalPrice - offers;
        product.offerPrice = LoadedPrices;
        product.save();
      })
    }
            return res.json({message:"Offer has been applied to the entire Restaurant" , products:products})
  }) 
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }); 

}