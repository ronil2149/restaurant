const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const feedbackSchema = new Schema({
    title:{
        type:String
    },
    message:{
        type:String
    },
    creator:[{
        type:Schema.Types.ObjectId,
        ref:'User'
        
    }]
});
    module.exports = mongoose.model('FEEDBACK',feedbackSchema);