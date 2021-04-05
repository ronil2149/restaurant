const Manager = require('../models/manager');
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

exports.addManager = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
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
    const manager = new Manager({
        name: name,
        email: email,
        phone: phone,
        password: sha1        
    })
    return manager.save()
        .then(user => {
            res.status(201).json({ message: 'Manager created', managerId: manager._id });          
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.managerlogin = (req, res, next) => {
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    let loadedManager;

    Manager.findOne({ $or: [{ email: email }] })
        .then(manager => {
            if (!manager) {
                const error = new Error('A manager with this email or phone no. not found .');
                error.statusCode = 401;
                throw error;
            }
            var sha1 = crypto.createHash('sha1').update(password).digest('hex');
            console.log(sha1);
            loadedManager = manager;
            if (sha1 == manager.password) {
                return loadedManager;
            }
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            let accessToken = jwt.sign({ email: loadedManager.email, phone: loadedManager.phone, managerId: loadedManager._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "200s" });
            let refreshToken = jwt.sign({ email: loadedManager.email, phone: loadedManager.phone, managerId: loadedManager._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })
            refreshTokens.push(refreshToken);
            console.log(refreshTokens);
            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken, managerId: loadedManager._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}



exports.getManagers = (req, res, next) => {
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Manager.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Manager.find()
          .skip((CurrentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(managers => {
        res.status(200)
          .json({
            message: 'Fetched Managers Successfully',
            managers: managers,
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

  
exports.getManager = (req, res, next) => {
  const managerId = req.params.managerId;
  Manager.findById(managerId)
    .then(manager => {
      if (!manager) {
        const error = new Error('Could not find Manager.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Manager Found!.', manager: manager });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.managerforgot = (req, res, next) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, Number: true, alphabets: false });
    const email = req.body.email;
    let creator;
    let loadedUser;
    const ot = new OTP({
        ot: otp,
        creator: Manager._id,
        date: new Date()
    });
        Manager.findOne({ email: email })
            .then(manager => {
                if (!manager) {
                    const error = new Error('A Manager with this email could not be found');
                    error.statusCode = 404;
                    res.status(401).json({ message: 'A manager with this email could not be found' });
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
               
                return Manager.findOne({ email: email });
            })
            .then(manager => {
                creator = manager;
                manager.otps.push(ot);
                res.status(200).json({ message: 'your otp:', otp: otp, creator: { _id: creator._id } });
                return manager.save();
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
};



exports.managerreset = (req, res, next) => {
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
                return Manager.findOne({ email : email})
            }
        })    
        .then(manager => {
            if(!manager){
                res.status(401).json({ message: 'A manager with this email could not be found' });
            }
            else
            {const newPw = req.body.password;
            manager.password = newPw;
            var sha1 = crypto.createHash('sha1').update(newPw).digest('hex').toString();
            manager.password = sha1;
            manager.save();
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