const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var ItemSchema = new Schema({
  product_id: {
    type:Schema.Types.ObjectId,
            ref: 'Product',
  },
  productId:{
    type:Schema.Types.ObjectId,
    ref:'Product'
  },
  priority:{
    type:Number,
    required:true
  },
  qty: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.']
  },
  price: {
    type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        }
});
const CartSchema = new Schema({
  email: {
    type: String,
    required: true,
    match: [
      /[\w]+?@[\w]+?\.[a-z]{2,4}/,
      'The value of path {PATH} ({VALUE}) is not a valid email address.'
    ]
  },
  items: [ItemSchema],
  subTotal: {
            default: 0,
            type: Number
        }
 
},{
        timestamps: true
    }
);
CartSchema.statics = {
  get ({ email } = {}) {
    let condition = { email: email };
    return this.findOne(condition).exec();
  }
};
module.exports = mongoose.model('cart', CartSchema);