const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const feedbackSchema = new Schema(
    {
        user: [{
            type: Schema.Types.ObjectId,
            ref: 'All'
        }], 
        rating:{
            type:Number,
            required:true,
            min: 1,
            max: 5
        },
        title:{
            type:String,
        },
        message:{
            type:String,
            required:true
        }
    }
)

module.exports = mongoose.model('Feedback',feedbackSchema)