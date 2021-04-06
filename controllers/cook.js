const Cook = require('../models/cook');
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


exports.addCook = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const phone = req.body.phone;
    const name = req.body.name;
    const password = req.body.password;
    const sha1 = crypto.createHash('sha1').update(password).digest('hex');
    const cook = new Cook({
        name: name,
        email: email,
        phone: phone,
        password: sha1
    })
    return cook.save()
        .then(result => {
            res.status(201).json({ message: 'Cook created', cookId: cook._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.cooklogin = (req, res, next) => {
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    let loadedCook;

    Cook.findOne({ $or: [{ email: email }] })
        .then(cook => {
            if (!cook) {
                const error = new Error('A cook with this email could  be found.');
                error.statusCode = 401;
                throw error;
            }
            var sha1 = crypto.createHash('sha1').update(password).digest('hex');
            console.log(sha1);
            loadedCook = cook;
            if (sha1 == cook.password) {
                return loadedCook;
            }
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            let accessToken = jwt.sign({ email: loadedCook.email, phone: loadedCook.phone, cookId: loadedCook._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "200s" });
            let refreshToken = jwt.sign({ email: loadedCook.email, phone: loadedCook.phone, cookId: loadedCook._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })
            refreshTokens.push(refreshToken);
            console.log(refreshTokens);
            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken, cookId: loadedCook._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


exports.getCooks = (req, res, next) => {
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Cook.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Cook.find()
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(cooks => {
        res.status(200)
          .json({
            message: 'Fetched Cooks Successfully',
            cooks: cooks,
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

  
exports.getCook = (req, res, next) => {
  const cookId = req.params.cookId;
  Cook.findById(cookId)
    .then(cook => {
      if (!cook) {
        const error = new Error('Could not find Cook.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Cook Found!.', cook: cook });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.cookforgot = (req, res, next) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, Number: true, alphabets: false });
    const email = req.body.email;
    let creator;
    let loadedUser;
    const ot = new OTP({
        ot: otp,
        creator: Cook._id,
        date: new Date()
    });
        Cook.findOne({ email: email })
            .then(cook => {
                if (!cook) {
                    const error = new Error('A cook with this email could not be found');
                    error.statusCode = 404;
                    res.status(401).json({ message: 'A cook with this email could not be found' });
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
               
                return Cook.findOne({ email: email });
            })
            .then(cook => {
                creator = cook;
                cook.otps.push(ot);
                res.status(200).json({ message: 'your otp', otp: otp, creator: { _id: creator._id } });
                return cook.save();
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
};



exports.cookreset = (req, res, next) => {
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
                return Cook.findOne({ email : email})
            }
        })    
        .then(cook => {
            if(!cook){
                res.status(401).json({ message: 'A cook with this email could not be found' });
            }
            else
            {const newPw = req.body.password;
            cook.password = newPw;
            var sha1 = crypto.createHash('sha1').update(newPw).digest('hex').toString();
            cook.password = sha1;
            cook.save();
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