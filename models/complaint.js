const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const complaintSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        },
        title:{
            type:String,
        },
        message:{
            type:String,
            required:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:'All'
        },
        replyId:[{
            type:Schema.Types.ObjectId,
            ref:'Reply'
        }]
    }
)

module.exports = mongoose.model('Complaint',complaintSchema)