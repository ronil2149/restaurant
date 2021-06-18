const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const allSchema = new Schema({  
    email: {
        type: String,
        required: true,
        unique:true,
        match: [/[\w]+?@[\w]+?\.[a-z]{2,4}/, 'The value of path {PATH} ({VALUE}) is not a valid email address.']
      },           
    phone:{
        type: String,
        unique:true,
        validate: {
            validator: function(v) {
            return /\d{3}\d{3}\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        // required: [traue, 'User phone number required']
    },
    password:{
        type: String,
        required:true,
        
    },
    active:{
        type:Boolean,
        default:true
    },
    name:{
        type:String,
        required:true
    },
   
    otps:[{
        type: Schema.Types.ObjectId,
        ref : 'OTP'
        
    }],
        resetToken:String,
        resetTokenExpiration:Date,
    feedbacks:[{
        type: Schema.Types.ObjectId,
        ref : 'Feedback'
    }],
    orders:[{
        type:Schema.Types.ObjectId,
        ref:'Order'
    }],
    activerole:{
        type:String,
        required:true,
        default:'user'
    },
    roles:{
        type:[String],
        default:['user']
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        default:null
    },
    activatedAt:Date,
    deactivatedAt:Date,
    complaints:[{
        type:Schema.Types.ObjectId,
        ref:'Complaint'
    }]
}
,{timestamps: { createdAt: 'created_At', updatedAt: 'updated_At', expireAt:'expired_at' }});

allSchema.methods.addtocart = function(product){
    let cart = this.cart;
    if(cart.items.length == 0){
        cart.items.push({productId:product_id});
        cart.totalPrice = product.price;
        console.log(user);
    }
}

allSchema.plugin(uniqueValidator);

module.exports = mongoose.model('All',allSchema);

