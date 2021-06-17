const Category = require('../models/category');
const Product = require('../models/product');
const path = require('path');
const fs = require('fs');


exports.getCategories = (req, res, next) => {
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Category.find().populate('products')
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Category.find().populate('products').populate({path:"products",populate:{
          path: "ingredients"
        }
      })
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(categoryposts => {
        res.status(200)
          .json({
            message: 'Fetched category Successfully',
            categoryposts: categoryposts,
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


exports.createCategory =  (req, res, next) => {
    const categoryName = req.body.categoryName;
    const imageUrl = req.file.path;
    let creator;
    const category = new Category({
      categoryName: categoryName,
      imageUrl: `http://192.168.0.3:8080/${imageUrl}`,
      creator: {name:'Manager'}
    });
    category
    .save()
    .then(result => {
      res.status(201).json({        
        message: 'category created successfully!',
        category: result,
        
      });
    })
      .catch(err => {
        if (!err.statusCode) {
         
          err.statusCode = 500;
        }
        next(err);
      });
  
  };

exports.getSingle = (req, res, next) => { 
    const categoryId = req.params.categoryId;
    Category.findById(categoryId)
      .then(category => {
        if (!category) {
          const error = new Error('Could not find Category.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'Category fetched.', category: category });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

exports.updateOne = (req, res, next) => {
    const categoryId = req.params.categoryId;
    const categoryName = req.body.categoryName;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }
    Category.findById(categoryId)
      .then(category => {
        if (!category) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        if (imageUrl !== categoryName.imageUrl) {
          clearImage(category.imageUrl);
        }
        category.categoryName = categoryName;
        category.imageUrl = `http://192.168.0.2:8080/${imageUrl}`;
        return category.save();
      })
      .then(result => {
        res.status(200).json({ message: 'category updated!', category: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

exports.deleteOne = (req, res, next) => {
    const categoryId = req.params.categoryId;
    Category.findById(categoryId)
      .then(category => {
        if (!category) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        clearImage(category.imageUrl);
        return Category.findByIdAndDelete(categoryId);
      })
      .then(result => {
        console.log(result);
        res.status(200).json({ message: 'category deleted!!' })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};

exports.deleteCategorywithProducts = (req, res, next) => {
  const categoryId = req.params.categoryId;
  var loadedPosts = [];
  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      clearImage(category.imageUrl);
      category.remove()
      return Product.find({categoryId})
    })
    .then(products =>{
      loadedPosts = products;
      loadedPosts.forEach(product =>{
        product.remove();
      })
    })
    .then(result => {
      // console.log(result);
      res.status(200).json({ message: 'category deleted!!' , deletedProducts : loadedPosts })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};

