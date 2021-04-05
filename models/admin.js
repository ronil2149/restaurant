const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const validator = require('validator')

const adminSchema = new Schema({  
    email: {
        type: String,
        required: true,
        match: [/[\w]+?@[\w]+?\.[a-z]{2,4}/, 'The value of path {PATH} ({VALUE}) is not a valid email address.']
      },
               
    phone:{
        type: String,
        validate: {
            validator: function(v) {
            return /\d{3}\d{3}\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, ' phone number required']
    },
    password:{
        type: String,
        required:true,
        
    },
    name:{
        type:String,
        required:true
    },   
    managers:[{
        type: Schema.Types.ObjectId,
        ref : 'Manager'
        
    }],
    otps:[{
        type: Schema.Types.ObjectId,
        ref : 'OTP'
        
    }],
        resetToken:String,
        resetTokenExpiration:Date,
   
},{timestamps: { createdAt: 'created_At', updatedAt: 'updated_At', expireAt:'expired_at' }});


 module.exports = mongoose.model('Admin',adminSchema);