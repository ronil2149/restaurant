const Revenue = require('../models/revenue');
const Order = require('../models/order');


exports.GetByDay = (req, res) => {
    const todays= req.body.todays;    
    Order.aggregate([    
    {$project: {_id:1, day:{$dayOfMonth:"$createdAt"},grandTotal:1}},
   {$group: {_id:{day:"$day"}, sum:{$sum:"$grandTotal"}}},
   {$match : {"_id.day" : todays    }}
],
function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
})
.catch(error => console.error(error))
}


exports.GetByMonth =  (req, res) => {
    const dates= req.body.dates;
    Order.aggregate([
    {$project: {_id:1,date:{$dateToString: { format: "%m/%Y", date: "$createdAt"}},grandTotal:1}},
    {$group : 
      {_id:{date:"$date"}, sum:{$sum:"$grandTotal"}}
    },
    {$match : {"_id.date" : dates    }}
  ],
  function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })
  .catch(error => console.error(error))
  }


exports.GetByYear =   (req, res) => {
    const years= req.body.years;    
    Order.aggregate([    
    {$project: {_id:1,date:{$dateToString: { format: "%Y", date: "$createdAt"}},grandTotal:1}},
    {$group : 
      {_id:{date:"$date"}, sum:{$sum:"$grandTotal"}}
    },
    {$match : {"_id.date" : years    }}
  ],
  function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })
  .catch(error => console.error(error))
  }

exports.DateWise = (req, res) => {
    const dates= req.body.dates;
    Order.aggregate([    
    {$project: {_id:1,date:{$dateToString: { format: "%d/%m/%Y", date: "$createdAt"}},grandTotal:1}},
    {$group : 
      {_id:{date:"$date"}, sum:{$sum:"$grandTotal"}}
    },
    {$match : {"_id.date" : dates    }}
  ],
  function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })
  .catch(error => console.error(error))
  }

  exports.Sum = (req, res) => {
    Order.aggregate([
    {
      $group: {
        _id: "$orderId",
        total: {
          $sum: "$grandTotal"
        }
      }
    }
  ])
    .then(results => {
        res.send({ grandtotal: results[0].total });
    })
    .catch(error => console.error(error))
}


exports.Accordingly = (req, res) => {
  const startdate= req.body.startdate;
  const enddate= req.body.enddate;
  
  Order.aggregate([
    {
           $match: {
              createdAt: {
                 $gte: new Date(startdate),
                 $lte: new Date(enddate)
              }
           }
        }, {
     $group: {
        _id: 1,
        SUM: {
           $sum: "$grandTotal"
        },
        COUNT: {
           $sum: 1
       }
     }
     }],
function(err, result) {
  if (err) {
    res.send(err);
  } else {
    res.json({result:result});
  }
})
.catch(error => console.error(error))
};