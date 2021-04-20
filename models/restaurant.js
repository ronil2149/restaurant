// import mongoose, { Schema } from 'mongoose';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  RestaurantName:{
      type:String
  }
  // ...other fields
},{
  timestamps:true
});

// const myDB = mongoose.connection.useDb('myDB');

// const UserInfo = myDB.model('userInfo', restaurantInfoSchema);

module.exports = mongoose.model('Restaurant', restaurantSchema);