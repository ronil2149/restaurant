const mongoose = require('mongoose');

const Restaurant = require('../models/restaurant');


exports.MakeRestaurant = async (req,res,next) =>{
    const RestaurantName = req.body.RestaurantName;
    const restaurant =await new Restaurant({
        RestaurantName:RestaurantName
    })
    restaurant.save()
    .then(restaurant=>{
        return res.status(201).json({message:"Restaurant created!" , Restaurant : restaurant})
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;e
        }
        next(err);
    });
    
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