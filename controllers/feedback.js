  const FeedBack = require('../models/feedback');
  const User = require('../models/user');
  const auth = require('../middleware/is-auth');
  const All = require('../models/all');

 exports.GiveFeedback = (req,res,next)=>{
      const rating = req.body.rating;
      const title = req.body.title;
      let token = req.headers['authorization'];
      token = token.split(' ')[1];
      const message = req.body.message;
      All.findOne({email})
      .then(all => {
        if (!all) {
            const error = new Error('An user with this id could not be found');
            error.statusCode = 401;
            throw error;
        }
        if(rating>5 || rating <1){
          const error = new Error('enter belove 5 and above 1 ');
          error.statusCode = 401;
          throw error;
        }
        const feedback = new FeedBack({
            rating : rating,
            title: title,
            message: message
        })
        feedback.user.push(all);
        feedback.save();
        all.feedbacks.push(feedback);
        all.save();
        return res.status(200).json({message:'Thank you for your feedback', feedback:feedback});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
  }


  exports.GetFeedbacks = (req, res, next) => {
      const CurrentPage = req.query.page || 1;
      const perPage = 10;
      let totalItems;
      FeedBack.find()
        .countDocuments()
        .then(count => {
          totalItems = count;
          return FeedBack.find()
            .skip((CurrentPage - 1) * perPage)
            .limit(perPage)
        })
        .then(feedbacks => {
          res.status(200)
            .json({
              message: 'Fetched feedback Successfully',
              feedbacks: feedbacks,
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


    exports.GetOne = (req, res, next) => {
      const feedbackId = req.params.feedbackId;
      FeedBack.findById(feedbackId)
        .then(feedback => {
          if (!feedback) {
            const error = new Error('Could not find feedback.');
            error.statusCode = 404;
            throw error;
          }
          res.status(200).json({ message: 'feedback fetched.', feedback: feedback });
        })
        
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    };

    exports.Average =  (req, res) => {
      FeedBack.aggregate([
      {
        $group: {
          _id: "$userId",
          avgrating: {
            $avg: "$rating"
          }
        }
      }
    ])
      .then(results => {
          res.send({ rating: results[0].avgrating });
      })
      .catch(error => console.error(error))
  };


  