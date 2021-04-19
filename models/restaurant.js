// import mongoose, { Schema } from 'mongoose';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantInfoSchema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  RestaurantName:{
      type:String
  }
  // ...other fields
});

// const myDB = mongoose.connection.useDb('myDB');

// const UserInfo = myDB.model('userInfo', restaurantInfoSchema);

module.exports = mongoose.model('Restaurant', restaurantInfoSchema);