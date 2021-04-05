const fs = require('fs');
const path = require('path');
const Cart = require('../models/Cart2');
const Product = require('../models/product');
// const product = require('../models/product');
// const cartRepository = require('../middleware/repository');
let productDetails;

exports.add = (req, res, next) => {
  const email = req.body.email;
  const productId = req.params.productId;
  const qty = Number.parseInt(req.body.qty);
  let productDetails;
  // console.log('qty: ', qty);

  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        res.status(404).json({ message: "Could not find post" });
      }
      productDetails = product.price;
    })
  Cart.findOne({ email: email }).populate({
    path: "items.productId",
    select: "name price description imageUrl "
  })
    .then(cart => {
      if (!cart && qty <= 0) {
        throw new Error('Invalid request');
      } else if (cart) {
        const indexFound = cart.items.findIndex(item => {
          return item.productId === productId;
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
          cart.items[indexFound].total = cart.items[indexFound].qty * productDetails;
          cart.items[indexFound].price = productDetails
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else if (qty > 0) {
          cart.items.push({
            productId:productId,
            qty: qty,
            price: productDetails,
            total: parseInt(productDetails * qty)
          })
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else {
          throw new Error('Invalid request');
        }
        // console.log(productDetails);
        return cart.save();
      } else {
        const cartData = {
          email: email,
          items: [
            {
              productId: productId,
              qty: qty,
              price: productDetails,
              total: productDetails * qty,

            }],
          subTotal: parseInt(productDetails * qty)
        };
        cart = new Cart(cartData);
        // return newItem
        return cart.save();
      }
    })
    .then(savedCart => res.json(savedCart))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};


exports.subtract = function (req, res, next) {
  const  email = req.body.email;
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


exports.get = function (req, res, next) {
  const email = req.body.email;
  // console.log(email);
  if (!email) {
    const error = new Error('Not found')
    return next(error);
  }
  Cart.get({ email })
    .then(Cart => res.json(Cart))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.remove = function (req, res, next) {
  const email = req.body.email;
  Cart.get({ email })
    .then(Cart => Cart.remove())
    .then(deletedCart => res.json({ message: "Cart dropped", deletedCart: deletedCart }))
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