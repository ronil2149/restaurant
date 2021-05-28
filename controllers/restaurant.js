const Payment = require('../models/payment');
const restaurant = require('../models/restaurant');
const Restaurant = require('../models/restaurant');


exports.MakeRestaurant = async (req,res,next) =>{
    const RestaurantName = req.body.RestaurantName;
    let loadedRestaurant;
    const resto = new Restaurant({
        RestaurantName:RestaurantName
    })
        loadedRestaurant = resto;

        console.log('The process of making an restaurant available has been started....')
        var job = new CronJob('* * * * * 1', function() {
        loadedRestaurant.activity = false;
        loadedRestaurant.save();         
        console.log(loadedRestaurant.activity);
    }, null, false, 'America/Los_Angeles');
    job.start();
    resto.save();

    return res.status(200).json({message:"Restaurant created!" , RestaurantId : resto._id,message:"restaurant is available for the moment can you choose another one", restaurnat:resto})
}

exports.RemainingTime = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;
    const date = Date.now();
   
    var expire;
    Restaurant.findById(restaurantId)
        .then(restaurant=>{
            if(!restaurant){
                const error = new Error('There are no such restaurantts !!!');
                error.statusCode = 404;
                return res.status(404).json({message:'There are no such restaurants!!'})
            }
            else{
                expire=restaurant.expireAt;
                result = expire - date;
                result1 = result/(60*60*24*1000)
                
                return res.status(200).json({message:"The remaining days for this restaurant are..", daysleft:result1});
            }
        })
    .catch(error => console.error(error))
}


exports.Deactivate = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;

    Restaurant.findById(restaurantId)
        .then(restaurant =>{
            if(!restaurant){
                const error = new Error('There are no restaurants with this id !');
                error.statusCode = 404;
                throw error; 
            }
            else{
                restaurant.activity = false;
                restaurant.DeactivatedAt = Date.now();
                restaurant.save();
                return res.status(200).json({message:"This restaurant will be deactive from now on..", restaurant:restaurant})
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;e
            }
            next(err);
        });
}

exports.Activate = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;
    
    Restaurant.findById(restaurantId)
        .then(restaurant =>{
            if(!restaurant){
                const error = new Error('There are no restaurants with this id !');
                error.statusCode = 404;
                return res.status(404).json({message:'There are no restaurants with this id !'})
            }
            else{
                restaurant.activity = true;
                restaurant.ActivatedAt = Date.now();
                restaurant.save();
                return res.status(200).json({message:"Restaurat has been activated", restaurant:restaurant})
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;e
            }
            next(err);
        });
}

exports.TimeItTook = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;
    let days;
    let hours;
    let minutes;
    let seconds;
    Restaurant.findById(restaurantId)
    .then(restaurant=>{
      if(!restaurant){
        return res.status(404).json({message:"There are no such restaurant!"})
      }
      else {
      let Date1 = restaurant.DeactivatedAt
      let Date2 = restaurant.ActivatedAt
      let res = (Date2 - Date1) / 1000;
      // var days = Math.floor(res / 86400);  
      // var hours = Math.floor(res / 3600) % 24;
      // var minutes = Math.floor(res / 60) % 60;
      hours = Math.floor(res / 3600) % 24;
      minutes = Math.floor(res / 60) % 60;
      seconds =Math.floor (res % 60);
      }
      return res.status(200).json({message:`The time it took to reactivate the restaurant was  ${hours} hours and ${minutes} minutes `});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  }

exports.Delete = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;

    Restaurant.findById(restaurantId)
    .then(restaurant=>{
        if(!restaurant){
            const error = new Error('There are no restaurants with this id !');
                error.statusCode = 404;
                // throw error;
                return res.status(404).json({message:'There are no restaurants with this id !'})
        }
        else{
            restaurant.remove();
            return res.status(200).json({message:'Restuarant has been deleted ',restaurant:restaurant})
        }
    })
}

exports.GetRestaurants = (req,res,next) =>{
    const activity = req.body.activity;
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalRestaurants;
    Restaurant.find({activity:activity})
    .countDocuments()
    .then(count => {
      totalRestaurants = count;
      return Restaurant.find({activity:activity})
        .skip((CurrentPage - 1) * perPage)
        .limit(perPage)
    })
        .then(restaurant=>{
            if(!restaurant){
                return res.status(404).json({message:"There are no person!!"});
            }
            else if(activity == ""){
                return res.status(404).json({message:"There are no Restauurants with this kinda activity"});
            }
            else{
                return res.status(200).json({message:"Here is the list you asked for..", list:restaurant, totalRestaurants : totalRestaurants});
            }           
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


exports.TotalRestaurants = (req,res,next) =>{
    const activity = req.body.activity;
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalRestaurants;
    Restaurant.find()
    .countDocuments()
    .then(count => {
      totalRestaurants = count;
      return Restaurant.find()
        .skip((CurrentPage - 1) * perPage)
        .limit(perPage)
    })
        .then(restaurant=>{
            if(!restaurant){
                return res.status(404).json({message:"There are no person!!"});
            }
            else if(activity == ""){
                return res.status(404).json({message:"There are no Restauurants with this kinda activity"});
            }
            else{
                return res.status(200).json({message:"Here is the list you asked for..", list:restaurant, totalRestaurants : totalRestaurants});
            }           
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.PaymentPending = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;

    Restaurant.findById(restaurantId)
        .then(restaurant=>{
            if(!restaurant){
                const error = new Error('There are no such restaurantts !!!');
                error.statusCode = 404;
                return res.status(404).json({message:'There are no such restaurants!!'})
            }
            else{
                restaurant.payment = "pending";
                restaurant.save();
                return res.status(200).json({message:"Payment status is now set to pending for this restaurant", restaurant:restaurant});
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


exports.paymentDone = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;
    Restaurant.findById(restaurantId)
        .then(restaurant=>{
            if(!restaurant){
                const error = new Error('There are no such restaurantts !!!');
                error.statusCode = 404;
                return res.status(404).json({message:'There are no such restaurants!!'})
            }
            else{
                restaurant.payment = "done";
                restaurant.save();
                return res.status(200).json({message:"Payment status is now set to pending for this restaurant", restaurant:restaurant});
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


exports.MakePayment = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;
    const amount = req.body.amount;
    const paidVia = req.body.paidVia;

    Restaurant.findById(restaurantId)
    .then(restaurant =>{
        if(!restaurant){
            const error = new Error('There are no such restaurant');
            error.statusCode = 404;
            return res.status(404).json({message:"There are no such restaurants", error:error}) 
        }
        else{
            const payment = new Payment({
                restaurantId : restaurantId,
                amount : amount,
                paidVia : paidVia
            })
            payment.save();
            restaurant.payment = "done";
            restaurant.activity = true;
            restaurant.ActivatedAt = Date.now();
            restaurant.payments.push(payment);
            restaurant.save();
            return res.status(200).json({message:"Payment's done!!", restaurant: restaurant})
        }
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.ViewHistory = (req,res,next) =>{
    const restaurantId = req.params.restaurantId;

    Restaurant.findById(restaurantId).populate({path:"payments"})
    .then(restaurant=>{
        if(!restaurant){
            const error = new Error('There are no such restaurant!');
            error.statusCode = 404;
            return res.json({error});
        }
        else{
            return res.status(200).json({message:"Here you go..." , restaurant : restaurant})

        }
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}