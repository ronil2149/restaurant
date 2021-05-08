const Order = require('../models/order');
const Cart = require('../models/Cart2');
const Product = require('../models/product');
const All = require('../models/all');
const order = require('../models/order');
let loadedUser;
var CronJob = require('cron').CronJob;


exports.add = (req,res,next) =>{
    const name = req.body.name;
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    const paymentMethod = req.body.paymentMethod;  
    let loadedCart;
    var loadedUser;
    All.findOne({email})
    .then(all=>{
      if(!all){
        const error = new Error('There are no such persons!!');
        error.statusCode = 404;
        throw error;
      }
      else{
        loadedUser = all;
        return Cart.findOne({email})
      }
      
    })    
    .then(cart=>{
        if(!cart){
          const error = new Error('Could not find Cart!!');
          error.statusCode = 404;
          throw error;
        }
        loadedCart = cart.items;
        subTotal = cart.subTotal;
        const order = new Order({
          name : name,
          paymentMethod: paymentMethod,
          email:email,
          grandTotal: subTotal,
          userId:id,
          items: loadedCart
      })
      order.save();      
      loadedUser.orders.push(order);
      loadedUser.save();
      // console.log(loadedUser)
      
      
      res.status(200).json({ orderId:order._id, userDetails:order ,Order: loadedCart });
      return Cart.findOneAndDelete({email})
    })
    .then(cart=>{
      cart.remove();
      
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.GetMyOrders = (req,res,next) =>{
  let token = req.headers['authorization'];
  token = token.split(' ')[1];
  All.findOne({email}).populate({path:"orders",populate:{
    path: "items.product_id"
  }
})
.populate({path:"orders",populate:{
  path: "items.categoryId"
}
})
.populate({path:"orders",populate:{
  path: "items.ingredientId"
}
})
  .then(all=>{
    if(!all){
      const error = new Error('THere are no such persons!!');
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({message:"here you go..", data:all})
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.GetMyCurrentOrders = (req,res,next) =>{
  let token = req.headers['authorization'];
  token = token.split(' ')[1];
  Order.find({email}).populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  }).populate({
    path: "items.categoryId"
  })
  .then(order =>{
    // console.log(order)
    order.forEach(order=>{
      // console.log(order)
      if(order.OrderIs == "Pending"){
        // console.log(order)
        return res.status(200).json({message:"Here's your order",order:order})
      }
      else if(order.OrderIs == "In Progress"){
        return res.status(200).json({message:"Here's your order",order:order})
      }
      else if(order.OrderIs == "Done"){
        return res.status(200).json({message:"Here's your order",order:order})
      }
    })
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
    Order.findById(orderId).populate({
      path: "items.product_id"
    }).populate({
      path: "items.ingredientId"
    }).populate({
      path: "items.categoryId"
    })
    .then(order=>{
        if(!order){
            return res.status(404).json({message:"please make an order first :)"})
        }
        return res.status(200).json({message:"The order", order:order})
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
    Order.find().populate({
      path: "items.product_id"
    }).populate({
      path: "items.ingredientId"
    }).populate({
      path: "items.categoryId"
    })
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Order.find().populate({path:"items",populate:{
          path: "product_id"
        }
      })
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
    .populate({
      path: "items.product_id"
    }).populate({
      path: "items.ingredientId"
    }).populate({
      path: "items.categoryId"
    })
    .then(order=>{
        if(!order){
            return res.status(404).json({message:"please make an order first :)"})
        }
        order.OrderIs='In Progress';
        order.OrderReceivedAt = Date.now();
        order.save();
        return res.status(200).json({message:"your orders has been received...please wait till we make it ready for you" , order:order });
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
        order.OrderIs = 'Cancelled';
        order.save();
        return Product.find()
    }).then(count => {
        totalItems = count;
        return Product.find()
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(products => {
        return res.status(200).json({message: 'Your order has been cancelled due to the unavailability of the product...can you please make another one :)',products: products})
        })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}


exports.DeleteOrder =  (req, res, next) => {
  let token = req.headers['authorization'];
  token = token.split(' ')[1];
  const orderId = req.params.orderId;
  Order.findOne({ email })
  .populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  }).populate({
    path: "items.categoryId"
  })
  .then(order=>{
    if(!order){
        return res.status(404).json({message:'Order does not exist'});
    }
    else if(order.OrderIs == "Pending"){
    order.remove()
    }
    else{
      return res.status(500).json({message:'You can not delete this order now!!'});
    }
  })
  // Order.findById(orderId)
    
    .then(deletedOrder => res.json({ message: "Order dropped ", deletedOrder: deletedOrder }))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.PreparedOrderList = (req,res,next) =>{
  const OrderIs = req.body.OrderIs;
  Order.find({OrderIs}).populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  }).populate({
    path: "items.categoryId"
  })
  .then(orders=>{
    return res.status(200).json({message:'Here is the list you asked for', list:orders})
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.ServeOrder = (req,res,next) =>{
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  }).populate({
    path: "items.categoryId"
  })
    .then(order=>{
        if(!order){
            return res.status(404).json({message:"There are no such order"})
        }
        order.OrderIs='Served';
        order.OrderServedAt = Date.now();
        order.save();
        return res.status(200).json({message:"Order has been served" ,order:order});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}


exports.DoneOrder = (req,res,next) =>{
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  }).populate({
    path: "items.categoryId"
  })
  .then(order =>{
    if(!order){
      return res.status(404).json({message:"There are no such orders"});
    }
    else{
      order.OrderIs = "Done";
      order.OrderDoneAt = Date.now();
      order.save();
      return res.status(200).json({message:"Order is done and is on it's way to you.", order:order})
    }
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};


exports.TimeItTook = (req,res,next) =>{
  const orderId = req.params.orderId;
  let days;
  let hours;
  let minutes;
  let seconds;
  Order.findById(orderId)
  .then(order=>{
    if(!order){
      return res.status(404).json({message:"There are no such order!"})
    }
    else {
    let Date1 = order.OrderReceivedAt
    let Date2 = order.OrderDoneAt
    let Date3 = order.OrderServedAt
    let res = (Date2 - Date1) / 1000;
    let res1 = (Date3 - Date2) / 1000;
    // var days = Math.floor(res / 86400);  
    // var hours = Math.floor(res / 3600) % 24;
    // var minutes = Math.floor(res / 60) % 60;
    hours = Math.floor(res / 3600) % 24;
    minutes = Math.floor(res / 60) % 60;
    minute = Math.floor(res1 / 60) % 60;
    seconds =Math.floor (res % 60);
    second = Math.floor (res1 % 60);
    }
    return res.status(200).json({message:`The time it took for cook to make the order was${hours} : ${minutes} hours and ${seconds} seconds.......Also it took ${minute} minutes and ${second} seconds for waiter to deliver it.`});
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.setDiscount = (req,res,next) =>{
  const orderId = req.params.orderId;
  const discount = req.body.discount;
  Order.findById(orderId)
  .then(order=>{
    if(!order){
      return res.status(404).json({message:"There are no such order!!"});
    }
    const offer = (order.grandTotal)/100 * discount;
    order.grandTotal = order.grandTotal - offer ;
    order.save();
    return res.status(200).json({message:"Sorry for the difficulties...here,let us help you with your order",order:order});
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}


exports.FindByCateId = (req,res,next) =>{
  const orderId = req.params.orderId;
  const categoryId = req.params.categoryId;
  var products =[]; 
  Order.findById(orderId)
  .populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  })
  .then(Order=>{
    if(!Order){
      return res.status(404).json({message:"there are no such orders"})
    }    
    products = Order.items;
    // console.log(products)
    const results = products.filter(item => item.categoryId === `${categoryId}`);
    return res.status(200).json({message:"the item you need to make is :" , item: results})
  }) 
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.AcceptByCateId = (req,res,next) =>{
  const orderId = req.params.orderId;
  const categoryId = req.params.categoryId;
  var products =[]; 
  Order.findById(orderId)
  .populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  })
  .then(Order=>{
    if(!Order){
      return res.status(404).json({message:"there are no such orders"})
    }    
    products = Order.items;
    const results = products.filter(item => item.categoryId === `${categoryId}`);
    results[0].progress ="In Progress";
    results[0].itemAcceptedAt = Date.now();
    Order.save();
    return res.status(200).json({message:"the item you accepted to make is :" , item: results})
  }) 
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}



exports.DoneByCateId = (req,res,next) =>{
  const orderId = req.params.orderId;
  const categoryId = req.params.categoryId;
  var products =[]; 
  Order.findById(orderId)
  .populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  })
  .then(Order=>{
    if(!Order){
      return res.status(404).json({message:"there are no such orders"})
    }    
    products = Order.items;
    const results = products.filter(item => item.categoryId === `${categoryId}`);
    results[0].progress ="Done";
    results[0].itemDoneAt = Date.now()
    Order.save();
    return res.status(200).json({message:"Done item :" , item: results})
  }) 
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}


exports.CancelByCateId = (req,res,next) =>{
  const orderId = req.params.orderId;
  const categoryId = req.params.categoryId;
  var products =[]; 
  let loadedProduct1;
  let loadedProduct;
  Order.findById(orderId)
  .populate({
    path: "items.product_id"
  }).populate({
    path: "items.ingredientId"
  })
  .then(Order=>{
    if(!Order){
      return res.status(404).json({message:"there are no such orders"})
    }    
    products = Order.items;
    const results = products.filter(item => item.categoryId === `${categoryId}`);
    results[0].progress ="Unavailable";
    loadedProduct1 = results[0].product_id;
    Order.save();
    // res.status(200).json({message:"the item you accepted to make is :" , item: results})
    return Product.findById(loadedProduct1);
  }) 
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
    return res.status(200).json({message:"The product you made unavailable is ",product:product})
  }})
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.WaiterCart = (req, res, next) => {
  const email = req.body.email;
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

All.findOne({email}).populate({
  path: "items.productId",
  select: "name price description imageUrl "
})
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
          cart.items[indexFound].total = cart.items[indexFound].qty * productDetails;
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
        path: "items.productId",
        select: "name price description imageUrl "
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
        path: "items.productId",
        select: "name price description imageUrl "
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


All.findOne({email}).populate({
  path: "items.productId",
  select: "name price description imageUrl "
})
    .then(all=>{
      if(!all){
        return res.status(403).json({message:'Register yourself first,will ya?!'})
      }
      return Cart.findOne({ email }).populate({
        path: "items.productId",
        select: "name price description imageUrl "
      })    
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
          cart.items[indexFound].total = cart.items[indexFound].qty * productDetails;
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
            total: parseInt((productDetails * qty) + Ingprice)
          })
          cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
        } else {
          throw new Error('Invalid request');
        }
        return cart.save((err,cart)=>{
          Cart.findOne(cart).populate({
        path: "items.productId",
        select: "name price description imageUrl "
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
              total: parseInt((productDetails * qty) + Ingprice)
            }],
            subTotal : parseInt((productDetails * qty) + Ingprice)
        };
        cart = new Cart(cartData);
        return cart.save((err,cart)=>{
          Cart.findOne(cart).populate({
        path: "items.productId",
        select: "name price description imageUrl "
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
}}



exports.WaiterOrder = (req,res,next) =>{
  const email = req.body.email;
  const phone = req.body.phone;
  const name = req.body.name;
  const paymentMethod = req.body.paymentMethod;  
  let loadedCart;
  var loadedUser;
  All.findOne({email})
  .then(all=>{
    if(!all){
      const error = new Error('There are no such persons!!');
      error.statusCode = 404;
      throw error;
    }
    else{
      loadedUser = all;
      return Cart.findOne({email})
    }
  })    
  .then(cart=>{
      if(!cart){
        const error = new Error('Could not find Cart!!');
        error.statusCode = 404;
        throw error;
      }
      loadedCart = cart.items;
      subTotal = cart.subTotal;
      const order = new Order({
        name : name,
        paymentMethod: paymentMethod,
        email:email,
        grandTotal: subTotal,
        // userId:id,
        items: loadedCart
    })
    order.save();      
    loadedUser.orders.push(order);
    loadedUser.save();    
    res.status(200).json({ orderId:order._id, userDetails:order ,Order: loadedCart });
    return Cart.findOneAndDelete({email})
  })
  .then(cart=>{
    cart.remove();
    
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}