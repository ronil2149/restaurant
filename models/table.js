const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator');
    
const tableSchema = new Schema({

    table:{type:Number,required:true},
    size:{type:Number,required:true},
    Status:{type:String},
    availableTime:Date,
    QRCode:{type:String},
    waiting: {type:Number,default:0},
    restaurantId:{type:Schema.Types.ObjectId},
    currentUser:{type:Schema.Types.ObjectId, ref:'All'},
    orders:[{
        type:Schema.Types.ObjectId,
        ref:'Order'
    }],
    userEmail:String,
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
    userName:String,
    persons:String

});

tableSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Table',tableSchema);