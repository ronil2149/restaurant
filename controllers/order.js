const Order = require('../models/order');
const Cart = require('../models/Cart2');
const Product = require('../models/product');


exports.add = (req,res,next) =>{
    const cartId = req.params.cartId;
    const name = req.body.name;
    const user = req.body.user;
    const email = req.body.email;
    const paymentMethod = req.body.paymentMethod;   

    Cart.findOne({email : email})
    .then(cart=>{
        if(!cart){
          return  res.json({message:'could not find cart'});
        }
        const order = new Order({
            name : name,
            paymentMethod: paymentMethod,
            email:email,
            order: cart            
        })
        order.save()
        res.status(200).json({ orderId:order._id, userDetails:order ,Order: cart });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}


exports.getOrder = (req,res,next) =>{
    const orderId = req.params.orderId;
    const email = req.body.email;
    Order.findById(orderId)
    .then(order=>{
        if(!order){
            return res.status(404).json({message:"please make an order first :)"})
        }
        return res.status(200).json({message:"your order", order:order})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}


exports.getOrders = (req, res, next) => {
    const CurrentPage = req.query.page || 1;
    const perPage = 20;
    let totalItems;
    Order.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Order.find()
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(orders => {
        res.status(200)
          .json({
            message: 'Fetched orders Successfully',
            orders: orders,
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
  


exports.receiveOrder = (req,res,next) =>{
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then(order=>{
        if(!order){
            return res.status(404).json({message:"please make an order first :)"})
        }
        return res.status(200).json({message:"your orders has been received...please wait till we make it ready for you" });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}


exports.cancelOrder = (req,res,next) =>{
    const orderId = req.params.orderId;
    const CurrentPage = req.query.page || 1;
    const perPage = 20;
    let totalItems;
    Order.findById(orderId)
    .then(order=>{
        if(!order){
            return res.status(404).json({message:'Please make an order first :)'});
        }
        return  Product.find()
    }).then(count => {
        totalItems = count;
        return Product.find()
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(products => {
        res.status(200)
          .json({
            message: 'Your order has been cancelled for security reasons...can you please make another one :)',
            products: products
          })
        })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}


exports.DeleteOrder =  (req, res, next) => {
  const email = req.body.email;
  const orderId = req.params.orderId;
  Order.findOne({ email : email })
  .then(order=>{
    if(!order){
        return res.status(404).json('Order does not exist')
    }
  })
  // Order.findById(orderId)
    .then(order => order.remove())
    .then(deletedOrder => res.json({ message: "Order dropped ", deletedOrder: deletedOrder }))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};