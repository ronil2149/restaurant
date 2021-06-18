const Reservation = require('../models/reservation');
const Order = require('../models/order');
const order = require('../models/order');
const Table = require('../models/table');
const QRCode = require('qr-image');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
var Jimp = require("jimp");
var fs = require('fs')
var qrCode = require('qrcode-reader');


exports.MakeResevation = function(req,res,next){
   // const restaurantId = req.params.restaurantId;
   let token = req.headers['authorization'];
   token = token.split(' ')[1];
   const persons = req.body.persons;
   console.log(name);
   Reservation.findOne({phone}).then(result=>{
       if (!result){
               const reservation = new Reservation({
               phone:phone,
               requestedtime:new Date(),
               waitingtime:null,
               checkintime:null,
               checkouttime:null,
               persons:persons,
               name:name,
               table:null,
               Status:'Finished',
           });
           reservation.save()
           .then(result => { 
               res.status(201).json({
                   message:"created successfully",
                   createdTable:reservation,
                  
               });
               newcustomer = reservation
               })          
       }
       else {
           res.status(500).json({error:'Reservation with this Number already exists!!!! Please use a different number'});
       }
   })
   .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}


exports.CreateTable = function(req,res){
    // const restaurantId = req.params.restaurantId;
    Table.find({table:req.body.table}).then(result => {
        if(result.length > 0){
            res.status(500).json({message:'Table Exists with same id !!! Please use a different id'});
        }
        else {
            const  tabledetails  =  new  Table ( {
                table:req.body.table,
                size:req.body.size,
                Status:'Available',
                availableTime:null,
                waiting:0,

            });
            tabledetails.save()
            .then(result => {
                const tablec =  JSON.stringify(tabledetails)
                
                const qrpng = QRCode.image(tablec, { type: 'png',ec_level: 'H', size: 10, margin: 0  });
                const table = req.body.table;
                qrpng.pipe(require('fs').createWriteStream('./images/'+`${table}`+ '.png'));
                
                const png_string = QRCode.imageSync(tablec, { type: 'png' });               
                tabledetails.QRCode = `http://localhost:8080/images/`+`${table}`+`.png`
                tabledetails.save();
                res.status(201).json({
                    message:"created successfully",
                    createdTable:tabledetails,
                    QRCode:'http://localhost:8080/images/'+`${table}`+ '.png'});
                // res.render("qr");                
            }).catch(err => {
                res.status(500).json({error:err});
            })
        }
    })
}

exports.GetTables = (req, res, next) => {
    let totalItems;
     Table.find()      
       .then(tables => {
         res.status(200)
           .json({
             message: 'tables fetched Successfully',
             tables: tables,
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


exports.DeleteTable = (req, res, next) => {
    // const restaurantId = req.params.restaurantId;

    const tableId = req.params.tableId;
    Table.findById(tableId)
      .then(table => {
        if (!table) {
          const error = new Error('Could not find table.');
          error.statusCode = 404;
          throw error;
        }
        return Table.findByIdAndDelete(tableId);
      })
      .then(result => {
        
        res.status(200).json({ message: 'Table deleted!!' })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }

  exports.GetReservations = function(req,res){
    // const restaurantId = req.params.restaurantId;
    Reservation.find({Status:{'$ne':'Finished'}}).sort({requestedtime:1}).then(result =>{
        if (result.length == 0){
            res.status(500).json({error: 'No Current Reservations'})
        }
        else {
            res.status(200).json({result:result})
        }
    }).catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}


exports.DeleteReservation =  (req, res, next) => {
    // const restaurantId = req.params.restaurantId;
    const reservationId = req.params.reservationId;
    Reservation.findById(reservationId)
      .then(reservation => {
        if (!reservation) {
          const error = new Error('Could not find reservation.');
          error.statusCode = 404;
          throw error;
        }
        return Reservation.findByIdAndDelete(reservationId);
      })
      .then(result => {
        console.log(result);
        res.status(200).json({ message: 'Reservation deleted!!' })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }

  exports.UpdateTable = (req, res, next) => {
    const tableId = req.params.tableId;
    const table = req.body.table;
    const size = req.body.size;
    
    if (!table) {
        const error = new Error('No table found.');
        error.statusCode = 422;
        throw error;
    }
    Table.findById(tableId)
        .then(tables => {
        if (!table) {
            const error = new Error('Could not find table.');
            error.statusCode = 404;
            throw error;
        }
        tables.table = table;
        tables.size = size;
        return tables.save();
        })
        .then(result => {
        return res.status(200).json({ message: 'table updated!', table: result});
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        });
    }
  
  
  exports.CheckIn = function(req,res,next){
   
        let token = req.headers['authorization'];
        token = token.split(' ')[1];
        var buffer = fs.readFileSync('./images' + '/2.png');
        const qr1 = Jimp.read(buffer, function(err, image) {
            if (err) {
                console.error(err);
            }
            let qrcode = new qrCode();
            qrcode.callback = function(err, value) {
                if (err) {
                    console.error(err);
                }
               
            };
            qrcode.decode(image.bitmap);
        });
        // const restaurantId = req.params.restaurantId;
        // var phone = req.body.phone;
        var table = req.body.table;
        // const table = req.params.table; 
        var requestedtime;
        Table.findOne({userEmail:email})
        .then(table=>{
            if(table){
              const error = new Error ("This person is already sitting on one of the tables")
                error.statusCode = 401;
                throw error;
            }
            else{
                return Reservation.find({phone:phone,Status:'Finished'}).count()
            }
        })
        
       .then(result =>{
            if (result) {
                Reservation.find({phone:phone,Status:'Finished'}).then(result =>{
                    requestedtime = new Date(result[0].requestedtime);
                    var waiting=  Math.round(((requestedtime.getTime() - new Date().getTime())/3600000)*-60)
                    
                    Table.find({"table":table}).then(result => {
                        if (result.length == 0) {
                            res.status(500).json({error:" Wrong table"});
                        }
                        else {
                            if (result[0].waiting >= 0 && (result[0].Status == 'Checkin' || result[0].Status == 'Available')) {
                                Table.updateOne({table:table},{$set:{waiting:result[0].waiting,Status:'Reserved',currentUser:id, userEmail: email , phone:phone, userName:name}})
                                .then(result =>
                                {
                                }).catch(err =>{ 
                                    console.log('error');
                                })
                                Reservation.updateOne({phone:phone,Status:'Finished'},{$set:{checkintime:new Date(),Status:'Checked In',waitingtime:waiting + " minutes"}})
                                .then(result =>
                                {
                                    res.status(200).json({
                                        message:"checkedin successfully",
                                    });
                                }).catch(err =>{
                                    res.status(500).json({error:err});
                                })
                            }   
                            else if (result[0].waiting == 0 && result[0].Status == 'Checkin'){
                                Table.updateOne({table:table},{$set:{Status:'Reserved'}})
                                .then(result =>
                                {
                                }).catch(err =>{ 
                                    console.log('error');
                                })
                                Reservation.updateOne({phone:phone,Status:'Finished'},{$set:{checkintime:new Date(),Status:'Checked In',waitingtime:waiting+ " minutes"}})
                                .then(result =>
                                {
                                    res.status(200).json({
                                        message:"checkedin successfully",
                                    });
                                }).catch(err =>{
                                    res.status(500).json({error:err});
                                })
                            }
                            else {
                                res.status(500).json({
                                error:"Table is not available"});
                            }
                        }
                    }).catch(err =>{
                    })
                }).catch(err =>{
                })
            }
    else {
        res.status(500).json({
            error:"Reservation not found"});
    }
    }) .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    }

exports.Scan = (req,res)=>{
    var buffer = fs.readFileSync('./images' + '/2.png');
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
        }
        let qrcode = new qrCode();
        qrcode.callback = function(err, value) {
            if (err) {
                console.error(err);
            }
            
        };
        qrcode.decode(image.bitmap);
    });
    }



exports.CheckOut = function(req,res,next){
    const phone = req.body.phone;
    const table = req.body.table;
    var Status;
    var fphone;
    var loadedOrder =[];
    var loadedTable;
    var ORDER =[];
    // Reservation.find({table:table,Status:'Checked In'}).sort({requestedtime:1}).then(result=>{
    //     fphone = result[0].phone;
    // })
    // const restaurantId = req.params.restaurantId;

    // Table.findOne({phone}).populate('orders')
    // .then(table =>{
    //     if(!table){
    //         const error = new Error('There are no such table!!');
    //         error.statusCode = 404;
    //         throw error;
    //     }
    //     else{
    //         loadedTable = table.orders;
    //         // console.log(loadedTable)
    //         loadedTable.forEach(order =>{

    //             // console.log(order)
    //             ORDER = order._id.toString();
    //             console.log(ORDER)
    //             Order.findById(ORDER)
    //             .then(order1=>{
    //                 if(!order1){
    //                     const error = new Error('There are no such order!!');
    //                     error.statusCode = 404;
    //                     throw error;
    //                 }
                   
    //                     console.log(order1)
    //                     loadedOrder = order;
    //                     // return Table.findOne({phone:phone});
                   
    //             })
    //         })
    //         // ORDER = loadedTable._id.toString();
    //         // ORDER.forEach(Order =>{
    //         //     return Order.findById(ORDER)
    //         // })
            
            
    //     }
    // })    
    
    // .then(table=>{
    //     if(!table){
    //         const error = new Error('There are no such table!!');
    //         error.statusCode = 404;
    //         throw error;
    //     }
    //     else{
    //         table.orders.pull(loadedOrder);
    //         table.save();
    //         return Reservation.find({phone:phone,Status:'Checked In'})
    //     }
    // })
    Reservation.find({phone:phone,Status:'Checked In'})
    .then(result => {
        
        if(result.length > 0){
            Status = result[0].Status;
            if (result[0].checkintime == null)
            {
                var waiting = Math.round(((new Date().getTime() - result[0].requestedtime)/3600000)*60);
                Reservation.deleteOne({'phone':phone,'Status':{'$ne':'Finished'}},{$set:{checkouttime:new Date(), Status:'Finished',waitingtime:waiting + " minutes"}})
                .then(result =>{
                    res.status(200).json({
                        message:"checkout successfully",
                        
                    });
                }).catch(err =>{
                    res.status(500).json({error:err});
                })
            }
            else {
                Reservation.deleteOne({'phone':phone,'Status':{'$ne':'Finished'}},{$set:{checkouttime:new Date(), Status:'Finished'}})
                .then(result =>{
                    res.status(200).json({
                        message:"checkout successfully",
                        
                    });
                }).catch(err =>{
                    res.status(500).json({error:err});
                })
            }
            var ftime=0;
            // var add =0;
            var available;
            if (result[0].checkintime == null && result[0].waitingtime == null){
                ftime = Math.round(90 - (((new Date().getTime() - result[0].requestedtime)/3600000)*60));
            }
            else if (result[0].checkintime == null && result[0].waitingtime != null){
                ftime = 75;
            }
            else {
                ftime =  Math.round(75 - ((new Date().getTime() - result[0].checkintime)/3600000)*60);
            }
            Table.find({phone:phone}).then( result=>{                
                available = result[0].availableTime - 1000 * 60 * (ftime);
                if (result[0].waiting > 0 && Status == 'Checked In' || (result[0].Status != 'Reserved' && Status !='Checked In' && fphone==phone && result[0].waiting !=1)){
                   
                    Table.updateOne({phone:phone},{$set:{Status:'Checkin',availableTime:available,waiting:result[0].waiting}})
                    .then(result =>{
                        res.status(200).json({
                            message:"checkout successfully",
                            
                        });
                    }).catch(err =>{
                        res.status(500).json({error:err});
                    })
                } 
                else if(result[0].waiting == 1 && Status != 'Checked In'){
                    
                    Table.updateOne({phone:phone},{$set:{waiting:result[0].waiting,Status:'Available',availableTime:null}})
                    .then(result =>{
                        res.status(200).json({
                            message:"checkout successfull",
            
                        });
                    }).catch(err =>{
                        res.status(500).json({error:err});
                    })
                }
                else if(result[0].waiting > 0 && Status != 'Checked In'){
                    
                    Table.updateOne({phone:phone},{$set:{waiting:result[0].waiting,availableTime:available}})
                    .then(result =>{
                        res.status(200).json({
                            message:"checkout successfull",
                        });
                    }).catch(err =>{
                        res.status(500).json({error:err});
                    })
                }
                else {
                    Table.updateOne({phone:phone},{$set:{Status:'Available',availableTime:null, currentUser:null , userEmail:null, userName:null , phone:null , orders:[]}})
                    .then(result =>{
                        
                        return res.status(200).json({
                            message:"checkout successfull",
                        });
                    }).catch(err => {
                        if (!err.statusCode) {
                          err.statusCode = 500;
                        }
                        next(err);
                      })
                }
                })
        }
        else {
            res.status(500).json({error:"No valid reservation found"});
        }
    })
}



exports.OrderListOfTable = (req,res,next) =>{
    const table = req.body.table;
    const tableId = req.params.tableId;
    if(table == undefined){
    Table.findById(tableId).populate({path:"orders",populate:{
        path: "items.product_id"
      }
    })
    .populate({path:"orders",populate:{
      path: "items.categoryId"
    }
    })
    .populate({path:"orders",populate:{
      path: "items.ingredientId"
    }
    })
    .populate("currentUser")
    .then(table=>{
       
      return res.status(200).json({message:'Here is the list you asked for', list:table})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
else{
    Table.findOne({table}).populate({path:"orders",populate:{
        path: "items.product_id"
      }
    })
    .populate({path:"orders",populate:{
      path: "items.categoryId"
    }
    })
    .populate({path:"orders",populate:{
      path: "items.ingredientId"
    }
    })
    .populate("currentUser")
    .then(table=>{
       
      return res.status(200).json({message:'Here is the list you asked for', list:table})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}
  }
  

  exports.WaiterMakeResevation = function(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed!');
        error.statusCode = 422;
        error.data = errors.array();
        return res.status(500).json({message:"mmm...somthing seems wrong here!!  you sure,you added the right credentials?"})
    }
    const persons = req.body.persons;
    const name = req.body.name;
    const phone = req.body.phone;
    // console.log(name);
    Reservation.findOne({phone}).then(result=>{
        if (!result){
                const reservation = new Reservation({
                phone:phone,
                requestedtime:new Date(),
                waitingtime:null,
                checkintime:null,
                checkouttime:null,
                persons:persons,
                name:name,
                table:null,
                Status:'Finished',
            });
            reservation.save()
            .then(result => { 
                res.status(201).json({
                    message:"created successfully",
                    createdTable:reservation,
                   
                });
                newcustomer = reservation
                })          
        }
        else {
            res.status(500).json({error:'Reservation with this Number already exists!!!! Please use a different number'});
        }
    })
    .catch(err => {
        if (!err.statusCode) {
                err.statusCode = 500;
                return res.status(500).json({message:"mmm...somthing seems wrong here!!  you sure,you added the right credentials?"})
            }
            next(err);
        })
 }
 
 
  exports.WaiterBookTable = (req,res,next) =>{
    const userEmail = req.body.email;
    const table = req.body.table;
    const userName = req.body.name;
    const phone = req.body.phone;

    Table.findOne({table:table})
    .then(table =>{
        if(!table){
            const error = new Error('There are no such tables!!');
            error.statusCode = 404;
            throw error; 
        }
        else{
            table.Status = "Reserved"
            table.userEmail = userEmail;
            table.phone = phone;
            table.userName = userName;
            table.save();
            return res.json({message:"User got this table!" , table : table})
        }
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  
  }