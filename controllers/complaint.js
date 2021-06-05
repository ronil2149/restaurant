const Complaint = require('../models/complaint');
const Order = require('../models/order');
const All = require('../models/all');

exports.MakeComplaint = (req,res,next)=>{
  const title = req.body.title;
  const message = req.body.message;
    const orderId = req.params.orderId;
    let loadedAll;
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    All.findById(id)
    .then(all=>{
      // console.log(all);
      loadedAll  = all;
      return  Order.findById(orderId)
    })  
    .then(order => {
       if (!order) {
           const error = new Error('An order with this id could not be found');
           error.statusCode = 401;
           throw error;
       } 
       const complaint = new Complaint({
           title: title,
           message: message,
           orderId:orderId,
           userId:id
       })
       complaint.save();
       order.complaints.push(complaint);
       order.save();
       loadedAll.complaints.push(complaint);
       loadedAll.save();
      //  console.log(loadedAll)
       return res.status(200).json({message:'complaint saved!',complaint:complaint});
   })
   .catch(err => {
       if (!err.statusCode) {
           err.statusCode = 500;
       }
       next(err);
   })
}

exports.WaiterComplaint = (req,res,next)=>{
  const title = req.body.title;
  const phone = req.body.phone;
  const message = req.body.message;
    const orderId = req.params.orderId;
    let loadedAll;
    // let token = req.headers['authorization'];
    // token = token.split(' ')[1];
    All.findOne({phone})
    .then(all=>{
      // console.log(all);
      loadedAll  = all;
      return  Order.findById(orderId)
    })  
    .then(order => {
       if (!order) {
           const error = new Error('An order with this id could not be found');
           error.statusCode = 401;
           throw error;
       } 
       const complaint = new Complaint({
           title: title,
           message: message,
           orderId:orderId,
           userId:id
       })
       complaint.save();
       order.complaints.push(complaint);
       order.save();
       loadedAll.complaints.push(complaint);
       loadedAll.save();
      //  console.log(loadedAll)
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
        return Complaint.find().populate({path:"orderId"}).populate({path:"userId"})
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
    Complaint.findById(complaintId).populate({path:"userId"}).populate({path:"orderId"})
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


  exports.DeleteComplaint = (req,res,next) =>{
    const complaintId = req.params.complaintId;

    Complaint.findById(complaintId)
    .then(complaint =>{
      if(!complaint){
        const error = new Error('There are no such complaints!!!');
        error.statusCode = 404;
        throw error
      }
      else{
        complaint.status = "Done";
        complaint.save();
        return res.json({message:"Deleted!!", complaint:complaint})
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  }
