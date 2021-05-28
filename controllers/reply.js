const Complaint = require('../models/complaint');
const Reply = require('../models/reply');
// const auth = require('../middleware/is-auth');
// const All = require('../models/all')

exports.MakeReply = (req,res,next)=>{
    const message = req.body.message;
      const complaintId = req.params.complaintId;
      let loadedAll;
      Complaint.findById(complaintId)
      .then(complaint => {
         if (!complaintId) {
             const error = new Error('An complaint with this id could not be found');
             error.statusCode = 401;
             throw error;
         } 
         const reply = new Reply({
             message: message,
             complaintId:complaintId
         })
         reply.save();
         complaint.replyId.push(reply);
         complaint.status = "Done";
         complaint.save();
         return res.status(200).json({message:'Thank you for your reply!..',reply:reply});
     })
     .catch(err => {
         if (!err.statusCode) {
             err.statusCode = 500;
         }
         next(err);
     })
  }
  

exports.GetReply = (req, res, next) => {
    const complaintId = req.params.complaintId; 
    const replyId = req.params.replyId;

    Reply.findById(replyId).populate({path:"replies"}).populate({path:"complaintId"})
      .then(reply => {
        if (!reply) {
          const error = new Error('Could not find reply.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'reply fetched.', reply: reply });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.GetComplaint = (req, res, next) => {
    const complaintId = req.params.complaintId;
    const replyId = req.params.replyId;

    Complaint.findById(complaintId).populate({path:"complaint"}).populate({path:"replyId"})
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
  };

  exports.Getreplies= (req, res, next) => {
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Reply.find().populate('complaintId')
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Reply.find().populate('complaintId')
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(replies => {
        res.status(200)
          .json({
            message: 'Fetched replies Successfully',
            replies: replies,
            totalItems: totalItems
          });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  