const path = require('path');
const fs = require('fs');

const Product = require('../models/product');
const User = require('../models/user');

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};



// exports.getPosts = (req, res, next) => {
//   Post.find()
//     .then(posts => {
//       res
//         .status(200)
//         .json({ message: 'Fetched posts successfully.', posts: posts });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

exports.getProducts = (req, res, next) => {
  const CurrentPage = req.query.page || 1;
  const perPage = 20;
  let totalItems;
  Product.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Product.find()
        .skip((CurrentPage - 1) * perPage)
        .limit(perPage)
    })
    .then(products => {
      res.status(200)
        .json({
          // message: 'Fetched Menu Successfully',
           products,
          totalItems: totalItems
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        console.log(err);
      }
      next(err);
    });
};

exports.createProduct = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const imageUrl = req.file.path;
  const price = req.body.price;
  const availability = req.body.availability;
  let creator;
  const product = new Product({
    name: name,
    imageUrl: `http://192.168.0.3:8080/${imageUrl}`,
    description: description,
    price:price,
    availability: availability,
    creator: {name:'Manager'}
  });
  product.save()
  // Product.findOne({name:name})
  // .then(product=>{
  //   if(product){
  //     return res.json({message:' Name is already taken'})
  //   }
  //   else if (!product){
  //     product.save();
      
  //   }
  // })
  .then(result=>{
    return res.status(201).json({message: 'Item created successfully!',product: product})
  })
    .catch(err => {
      if (!err.statusCode) {       
        err.statusCode = 500;
      }
      next(err);
    });

};


exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        res.json({message:'could not find it'})
      }
      res.status(200).json({ /*message: 'Product fetched.',*/ productName: product.name, productPrice: product.price, productDescription:product.description });
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
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
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
      if (imageUrl !== product.imageUrl) {
        clearImage(product.imageUrl);
      }
      product.title = title;
      product.imageUrl =`http://192.168.0.3:8080/${imageUrl}`;
      product.content = content;
      return product.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Product updated!', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.UnavailableItem = (req,res,next) =>{
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product=>{
      if(!product){
        return res.status(404).json({message:'There are no such products'});
      }
      product.availability = "unavailable";
      product.save();
      return res.status(200).json({message:"Product is unavailable for the moment can you choose another one"})
    })
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
      product.availability = 'available';
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
      // console.log(product.imageUrl)
      clearImage(product.imageUrl);
      return Product.findByIdAndDelete(productId);
    })
    .then(result => {
      // console.log(result);
      res.status(200).json({ message: 'Product deleted!!' })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

