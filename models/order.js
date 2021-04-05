const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderScema = new Schema({

    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: [
        /[\w]+?@[\w]+?\.[a-z]{2,4}/,
        'The value of path {PATH} ({VALUE}) is not a valid email address.'
      ]
    },
  paymentMethod: {
    type: String,
    default: 'cash_on_delivery'
  }
});


OrderScema.statics = {
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

  

module.exports = mongoose.model('Order', OrderScema);