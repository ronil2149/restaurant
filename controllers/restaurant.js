const mongoose = require('mongoose');

const Restaurant = require('../models/restaurant');


exports.MakeRestaurant = (req,res,next) =>{
    const RestaurantName = req.body.RestaurantName;
//     mongoose.connect('mongodb://localhost/default').Restaurant;

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//   console.log('connected');
// });

    const resto = new Restaurant({
        RestaurantName:RestaurantName
    })
    resto.save();
    return res.status(201).json({message:"Restaurant created!"})



}