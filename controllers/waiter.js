const Waiter = require('../models/waiter');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const OTP = require('../models/otp');
let refreshTokens = [];
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testkmsof@gmail.com',
        pass: 'Test@2015'
    }
});

exports.addWaiter= (req, res,next) => {      
    const email = req.body.email;
    const name = req.body.name;
    const phone = req.body.phone;
    const password = req.body.password;
    const sha1 = crypto.createHash('sha1').update(password).digest('hex');
    const waiter = new Waiter({
    email: email,
    phone:phone,
    password:sha1,
    name: name,
    });
    return waiter.save()
    .then(waiter=>{
    res.status(200).json({message:'waiter created', waiterId: waiter._id})
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
            return res.status(500).json({message:"mmm...somthing seems wrong here!!  you sure,you added right credentials?"})

        }
        next(err);
    })
}


exports.waiterlogin = (req, res, next) => {
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  let loadedWaiter;

  Waiter.findOne({ $or: [{ email: email }] })
      .then(waiter => {
          if (!waiter) {
              const error = new Error('A waiter with this email could  be found.');
              error.statusCode = 401;
              throw error;
          }
          var sha1 = crypto.createHash('sha1').update(password).digest('hex');
          loadedWaiter = waiter;
          if (sha1 == waiter.password) {
              return loadedWaiter;
          }
      })
      .then(isEqual => {
          if (!isEqual) {
              const error = new Error('Wrong password!');
              error.statusCode = 401;
              throw error;
          }
          let accessToken = jwt.sign({ email: loadedWaiter.email, phone: loadedWaiter.phone, waiterId: loadedWaiter._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
          let refreshToken = jwt.sign({ email: loadedWaiter.email, phone: loadedWaiter.phone, waiterId: loadedWaiter._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })
          refreshTokens.push(refreshToken);
          console.log(refreshTokens);
          res.status(200).json({
              accessToken: accessToken,
              refreshToken: refreshToken, waiterId: loadedWaiter._id.toString()
          });
      })
      .catch(err => {
          if (!err.statusCode) {
              err.statusCode = 500;
          }
          next(err);
      });
}

exports.getWaiters = (req, res, next) => {
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Waiter.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Waiter.find()
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(waiters => {
        res.status(200)
          .json({
            message: 'Fetched Waiters Successfully',
            waiters: waiters,
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

  
exports.getWaiter = (req, res, next) => {
  const waiterId = req.params.waiterId;
  Waiter.findById(waiterId)
    .then(waiter => {
      if (!waiter) {
        const error = new Error('Could not find Waiter.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Waiter Found!.', waiter: waiter });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};



exports.waiterforgot = (req, res, next) => {
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, Number: true, alphabets: false });
  const email = req.body.email;
  let creator;
  let loadedUser;
  const ot = new OTP({
      ot: otp,
      creator: Waiter._id,
      date: new Date()
  });
      Waiter.findOne({ email: email })
          .then(waiter => {
              if (!waiter) {
                  const error = new Error('A waiter with this email could not be found');
                  error.statusCode = 404;
                  res.status(401).json({ message: 'A waiter with this email could not be found' });
              }
            else{  transporter.sendMail({
                  to: email,
                  from: 'hello-here.com',
                  subject: 'RESET here!!!',
                  html: ` <p>Your OTP  ${otp}</p>
              <p>For password reset click</p>      
              <a href = http://localhost:8080/auth/reset/ here>here</a></p>`
              })
               ot.save();
          }
             
              return Waiter.findOne({ email: email });
          })
          .then(waiter => {
              creator = waiter;
              waiter.otps.push(ot);
              res.status(200).json({ message: 'your otp:', otp: otp, creator: { _id: creator._id } });
              return waiter.save();
          })
          .catch(err => {
              if (!err.statusCode) {
                  err.statusCode = 500;
              }
              next(err);
          })
};



exports.waiterreset = (req, res, next) => {
  const newPw = req.body.password;
  const email = req.body.email;
  const otp1 = req.body.otp1;
  OTP.findOne({ ot: otp1 })
      .then(ot => {
          if (!ot) {
              const error = new Error('An otp could not be found');
              error.statusCode = 404;
              res.json({ message: "An otp could not be found" });
          }
          else{
              return Waiter.findOne({ email : email})
          }
      })    
      .then(waiter => {
          if(!waiter){
              res.status(401).json({ message: 'A waiter with this email could not be found' });
          }
          else
          {const newPw = req.body.password;
          waiter.password = newPw;
          var sha1 = crypto.createHash('sha1').update(newPw).digest('hex').toString();
          waiter.password = sha1;
          waiter.save();
          res.status(200).json({message:'password updated!!'});
          return OTP.findOne({ ot: otp1 })  
          }                  
      })          
      .then(ot => {
          ot.ot = "";
          ot.save();
      })
      .catch(err => {
          if (!err.statusCode) {
              err.statusCode = 500;
          }
          next(err);
      })
};