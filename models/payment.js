const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
      restaurantId:{
          type:Schema.Types.ObjectId,
          ref:'Restaurant'
      },
      amount:{
          type:Number,
          required:true
      },
      paidVia:{
          type:String,
          required:true
      }
    },
      {
          timestamps:true
      });

      module.exports = mongoose.model('Payment', paymentSchema);

