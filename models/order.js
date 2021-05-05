const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
  },
  ingredientId:{
    type:Schema.Types.ObjectId,
    ref:'Ingredient'
  },
  categoryId:{
    type:String,
    ref:'Category'
  },
  qty: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.']
  },
  priority:{
    type:Number
  },
  productPrice: {
    type: Number,
            required: true,
  },
  ingredientPrice:{
    type:Number
  },
  total: {
          type: Number,
          required: true,
        }
});
const CartSchema = new Schema({
  
  items: [ItemSchema]
},{
        timestamps: true
    }
);

const OrderSchema = new Schema({

    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
    //   required: true,
      match: [
        /[\w]+?@[\w]+?\.[a-z]{2,4}/,
        'The value of path {PATH} ({VALUE}) is not a valid email address.'
      ]
    },
    userId:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    grandTotal: {
      default: 0,
      type: Number
  },
  paymentMethod: {
    type: String,
    default: 'cash'
  },
  items: [ItemSchema],
  OrderIs:{
    type:String,
    default:'Pending'
  },
  OrderReceivedAt:{
    type:Date
  },
  OrderDoneAt:{
    type:Date
  },
  OrderServedAt:{
    type:Date
  },
  complaints:[{
    type:Schema.Types.ObjectId,
    ref:'Complaint'
  }]

},{
  timestamps: true
});


OrderSchema.statics = {
  get (id) {
    return this.findById(id)
      .exec()
      .then(order => {
        if (order) {
          return order;
        }
        const err = new Error(
          'No such product exists!',         
        );
        return Promise.reject(err);
      });
  }
}

module.exports = mongoose.model('Order', OrderSchema);