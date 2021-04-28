const fs = require('fs');
const path = require('path');
const Cart = require('../models/Cart2');
const Product = require('../models/product');
const User = require('../models/user');
const All = require('../models/all');
const Ingredient = require('../models/ingredients');
let productDetails;

exports.addToCart = (req, res, next) => {
  let token = req.headers['authorization'];
  token = token.split(' ')[1];
  var productId = req.params.productId;
  var ingredientId = req.params.ingredientId;
  const priority = req.body.priority;
  const qty = Number.parseInt(req.body.qty);
  let productDetails;
  let Ingprice;
  console.log(req.params)

  if (ingredientId == undefined){
    Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Could not find post" });
      }
      Id = product._id;
      productDetails = product.offerPrice;
    })

All.findOne({email})
    .then(all=>{
      if(!all){
        return res.status(403).json({message:'Register yourself first,will ya?!'})
      }
      return Cart.findOne({ email })
    })
    .then(cart => {
      if (!cart && qty <= 0) {
        throw new Error('Invalid request');
      } else if (cart) {
        const indexFound = cart.items.findIndex(item => {
          return item.product_id === productId;
        });
        if (indexFound !== -1 && qty <= 0) {
          cart.items.splice(indexFound, 1);
          if (cart.items.length == 0) {
            cart.subTotal = 0;
          } else {
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
          }
        } else if (indexFound !== -1) {
          cart.items[indexFound].qty = cart.items[indexFound].qty + qty;
          cart.items[indexFound].total = cart.items[indexFound].qty * productDetails ;
          cart.items[indexFound].productPrice = productDetails;
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else if (qty > 0) {
          cart.items.push({
            productId :productId,
            qty: qty,
            priority:priority,
            productPrice: productDetails,
            total: parseInt((productDetails * qty))
          })
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else {
          throw new Error('Invalid request');
        }
        return cart.save((err,cart)=>{
          Cart.findOne(cart).populate({
        path: " items.productId"
      }).exec((err,cart)=> {
        return res.json({
                    status: 'success',
                    message: "product added in cart successfully",
                    cart:cart
                });
      })
        })
      } else {
        const cartData = {
          email: email,          
          items: [
            {
              productId : productId,
              qty: qty,
              priority: priority,
              productPrice: productDetails,
              total: parseInt((productDetails * qty))
            }],
            subTotal : parseInt((productDetails * qty))
        };
        cart = new Cart(cartData);
        return cart.save((err,cart)=>{
          Cart.findOne(cart).populate({
        path: "items.productId"
      }).exec((err,cart)=> {
        res.json({
                    status: 'success',
                    message: "product added in cart successfully",
                    cart:cart
                });
      })
        });
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}
else {
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Could not find post" });
      }
      Id = product._id;
      productDetails = product.offerPrice;
    })

    Ingredient.findById(ingredientId)
    .then(ingredient => {
      if (!ingredient) {
        return res.status(404).json({ message: "Could not find ingredient" });
      }
      Ingprice = ingredient.price;
    })


All.findOne({email})
    .then(all=>{
      if(!all){
        return res.status(403).json({message:'Register yourself first,will ya?!'})
      }
      return Cart.findOne({ email })
    })
    .then(cart => {
      if (!cart && qty <= 0) {
        throw new Error('Invalid request');
      } else if (cart) {
        const indexFound = cart.items.findIndex(item => {
          return item.product_id === productId;
        });
        if (indexFound !== -1 && qty <= 0) {
          cart.items.splice(indexFound, 1);
          if (cart.items.length == 0) {
            cart.subTotal = 0;
          } else {
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
          }
        } else if (indexFound !== -1) {
          cart.items[indexFound].qty = cart.items[indexFound].qty + qty;
          cart.items[indexFound].total = cart.items[indexFound].qty * productDetails ;
          cart.items[indexFound].productPrice = productDetails;
          cart.items[indexFound].ingredientPrice = Ingprice;
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else if (qty > 0) {
          cart.items.push({
            productId :productId,
            ingredientId : ingredientId,
            qty: qty,
            priority:priority,
            ingredientPrice:Ingprice,
            productPrice: productDetails,
            total: parseInt((productDetails * qty)+ (Ingprice * qty))
          })
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else {
          throw new Error('Invalid request');
        }
        return cart.save((err,cart)=>{
          Cart.findOne(cart).populate({
        path: "items.productId"
      }).exec((err,cart)=> {
        return res.json({
                    status: 'success',
                    message: "product added in cart successfully",
                    cart:cart
                });
      })
        })
      } else {
        const cartData = {
          email: email,          
          items: [
            {
              productId : productId,
              ingredientId : ingredientId,
              qty: qty,
              priority: priority,
              productPrice: productDetails,
              ingredientPrice:Ingprice,
              total: parseInt((productDetails * qty) + (Ingprice * qty))
            }],
            subTotal : parseInt((productDetails * qty) + (Ingprice * qty))
        };
        cart = new Cart(cartData);
        return cart.save((err,cart)=>{
          Cart.findOne(cart).populate({
            path: "items.productId"
          }).exec((err,cart)=> {
        res.json({
                    status: 'success',
                    message: "product added in cart successfully",
                    cart:cart
                });
      })
        });
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}
};
  


exports.add = function (req, res, next) {
  let token = req.headers['authorization'];
  token = token.split(' ')[1];
  const product_id = req.params.product_id;
  const qty = Number.parseInt(req.body.qty);
  const priority = req.body.priority;

  Product.findById(product_id)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Could not find post" });
      }
      Id = product._id;
      productDetails = product.price;
    })
  Cart.findOne({ email }).populate({
            path: "items",
            populate:{
              path:"product_id"
            }
          })
    .exec()
    .then(cart => {
      if (!cart && qty <= 0) {
        throw new Error('Invalid request');
      } else if (cart) {
        const indexFound = cart.items.findIndex(item => {
          return item.product_id === product_id;
        });
        if (indexFound !== -1 && qty <= 0) {
          cart.items.splice(indexFound, 1)
          if (cart.items.length == 0) {
            cart.subTotal = 0;
          } else {
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
          }
        } else if (indexFound !== -1) {
          cart.items[indexFound].qty = cart.items[indexFound].qty + qty;
          cart.items[indexFound].total = cart.items[indexFound].qty * productDetails;
          cart.items[indexFound].price = productDetails;
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else if (qty > 0) {
          cart.items.push({
            product_id: product_id,
            qty: qty,
            priority:priority,
            price: productDetails,
            total: parseInt(productDetails * qty)
          });
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else {
          throw new Error('Invalid request');
        }
        return cart.save();
      } else {
        const cartData = {
          email: email,
          items: [
            {
              product_id: product_id,
              qty: qty,
              priority: priority,
              price: productDetails,
              total: productDetails * qty,
            }
          ],
          subTotal: parseInt(productDetails * qty)
        };
        cart = new Cart(cartData);
        return cart.save();
      }
    })
    .then(savedCart => res.json(savedCart))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.subtract = function (req, res, next) {
  let token = req.headers['authorization'];
  token = token.split(' ')[1];
  const product_id = req.params.product_id;
  const qty = Number.parseInt(req.body.qty);
  let productDetails;
  console.log('qty: ', qty);
  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        res.status(404).json({ message: "Could not find product" });
      }
      else{productDetails = product.price;}
    })
  Cart.findOne({ email: email })
    .exec()
    .then(cart => {
      if (!cart || qty <= 0) {
        throw new Error('Invalid request');
      } else {
        const indexFound = cart.items.findIndex(item => {
          return item.product_id === product_id;
        });
        if (indexFound !== -1) {
          console.log('index Found: ', indexFound);
          console.log('before update items: ', cart.items);
          let updatedQty = cart.items[indexFound].qty - qty;
          let updatedTotal = updatedQty * productDetails;
          let updatedPrice = productDetails;
          if (updatedQty <= 0) {
            cart.items.splice(indexFound, 1);
          } else {
            cart.items[indexFound].qty = updatedQty;
            cart.items[indexFound].total = updatedTotal;
            cart.items[indexFound].price = updatedPrice;
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
          }
          console.log('after update items: ', cart.items);
          return cart.save();
        } else {
          throw new Error('Invalid request');
        }
      }
    })
    .then(updatedCart => res.json(updatedCart))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.get = (req, res, next) => {
  let token = req.headers['authorization'];
  token = token.split(' ')[1];
  if (!email) {
    return res.status(200).json({message:'Enter a valid email first'})
  }
  Cart.findOne({email:email}).populate({
    path: "items.productId"
  }).populate({
    path: "items.ingredientId"
  })
    .then(cart=>{
      if(!cart){
        return res.status(404).json({message:'Cart not found'})
      }
      return res.status(200).json({Your_Cart : cart})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.remove = function (req, res, next) {
  let token = req.headers['authorization'];
  token = token.split(' ')[1];
  Cart.get({ email })
    .then(Cart => Cart.remove())
    .then(deletedCart => res.json({ message: "Cart dropped ", deletedCart: deletedCart }))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.getInvoice = (req,res,next)=>{
  const cartId = req.params.cartId;
  const invoiceName = 'invoice-' + cartId + '.pdf';
  const invoicePath = path.join('invoices',invoiceName)
  fs.readFile(invoicePath,(err,data)=>{
    if(err){
     return next(err);
    }
    res.send(data)
  })
}