const Complaint = require('../models/complaint');
const Order = require('../models/order');

exports.MakeComplaint = (req,res,next)=>{
    const orderId = req.params.orderId;
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    const order = req.params.order;
    const title = req.body.title;
    const message = req.body.message;
    Order.findById(orderId)
    .then(order => {
       if (!orderId) {
           const error = new Error('An order with this id could not be found');
           error.statusCode = 401;
           throw error;
       }
      //  console.log(order)
       const complaint = new Complaint({
           title: title,
           message: message,
           orderId:orderId,
           user:id
       })
       complaint.save();
       order.complaints.push(complaint);
       order.save();
       return res.status(200).json({message:'complaint saved!',complaint:complaint});
   })
   .catch(err => {
       if (!err.statusCode) {
           err.statusCode = 500;
       }
       next(err);
   })
}


exports.GetComplaints = (req, res, next) => {
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Complaint.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Complaint.find()
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(complaints => {
        res.status(200)
          .json({
            message: 'Fetched complaint Successfully',
            complaints: complaints,
            totalItems: totalItems
          });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  
  }


  exports.GetOne = (req, res, next) => {
    const complaintId = req.params.complaintId;
    Complaint.findById(complaintId)
      .then(complaint => {
        if (!complaint) {
          const error = new Error('Could not find complaint.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'complaint fetched.', complaint: complaint });
      })
      
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }