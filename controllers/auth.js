var User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const otpTool = require("otp-without-db");
const key = "supersecretKey";
const OTP = require('../models/otp');
var user = require('../models/user');
const jwt = require('jsonwebtoken');
const FeedBack = require('../models/feedback');
const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, Number: true, alphabets: false });
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testkmsof@gmail.com',
        pass: 'Test@2015'
    }
});
let refreshTokens = [];


exports.signup = (req, res, next) => {
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
     // bcrypt.hash(password, 12)
    //     .then(hashedPw => {
    const user = new User({
        name: name,
        email: email,
        phone: phone,
        // password: hashedPw,
        password: sha1
        
    })
    return user.save()
        // })
        .then(user => {
            res.status(201).json({ message: 'user created', userId: user._id });
            // return user.save();

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })


};


   exports.login =  (req, res, next) => {
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        let loadedUser;
        
        User.findOne({$or: [{ email:email}]})
        .then(user => {
          if (!user) {
            const error = new Error('A user with this email  not found .');
            error.statusCode = 401;
            throw error;
          }
          var sha1 = crypto.createHash('sha1').update(password).digest('hex');
          console.log(sha1);
          loadedUser = user;
          if(sha1 == user.password){
            return loadedUser;
          }
        })
        .then(isEqual => {
          if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
          }
          let accessToken = jwt.sign({email:loadedUser.email ,phone: loadedUser.phone, userId: loadedUser._id.toString()},'somesupersecretaccesstoken',{expiresIn:"200s"});
          let refreshToken = jwt.sign({email:loadedUser.email,phone: loadedUser.phone,userId: loadedUser._id.toString()},'somesupersecretrefreshtoken',{expiresIn: "7d"})
          refreshTokens.push(refreshToken);
          console.log(refreshTokens);
          res.status(200).json({accessToken:accessToken,
            refreshToken:refreshToken,  userId: loadedUser._id.toString() });
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
        }


exports.protected = (req,res,next)=>{
    res.status(200).json({message:'you are authenticated'})
}

exports.refresh = (req,res,next)=>{
    const refreshToken = req.body.token;
    if(!refreshToken || !refreshTokens.includes(refreshToken)){
        return res.status(403).json({message:'Refresh token is not found!!'});
    }
    jwt.verify(refreshToken ,'somesupersecretrefreshtoken',(err,user)=>{
        if(!err){
            const accessToken = jwt.sign(
                {
                    email: user.email,
                    userId: user._id
                },
                'somesupersecretaccesstoken',
                { expiresIn: '100s' }
            );
            res.status(201).json({AccessToken:accessToken })
        }
        else{
            return res.status(403).json({message:'User is not authenticated'});
        }
    })
}

exports.forgotPw = (req, res, next) => {
    // const user = User.findById({ _id: req.params.userId });    
    const userId = req.params.userId;
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, Number: true, alphabets: false });
    const email = req.body.email;
    let creator;
    let loadedUser;
    const ot = new OTP({
        ot: otp,
        creator: User._id,
        date: new Date()
    });
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    const error = new Error('An user with this email could not be found');
                    error.statusCode = 401;
                    res.status(401).json({ message: 'An user with this email could not be found' });
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
                return User.findOne({ email: email });
            })
            .then(user => {
                creator = user;
                user.otps.push(ot);
                res.status(200).json({ message: 'your otp:', otp: otp, creator: { _id: creator._id } });
                return user.save();
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
};



//       ot.save()
//       .then(user=>{
//         if(email !== user.email){
//             res.status(401).json({message:'please enter a valid email add!'})
//         }
//         else{ res.status(200).json({message:'your otp:',
//         otp: otp,
//         creator:{_id:creator._id}})
//     }
//         return User.findById({_id:req.params.userId});
//       })
//     .then(user => {
//         creator = user; 
//         user.otps.push(ot);      
//        return user.save();
//         })
//         .then(result=>{                    
//             res.status(200).json({message:'your otp:',
//             otp: otp,
//             creator:{_id:creator._id}})           
//         })          
//         .then(result=>{
//             res.status(200).json({ message: 'Mail has been sent to ' + email , creator:{_id:creator._id} });
//             return ot.save();            
//         })     
//         .then(transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log('Email sent: ' + info.response);
//                 console.log(expire);
//                 console.log(otp);
//             }
//         }))
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// };



exports.resetPw = (req, res, next) => {
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
                return User.findOne({ email : email})
            }
        })    
        .then(user => {
            if(!user){
                res.status(401).json({ message: 'An user with this email could not be found' });
            }
            else
            {const newPw = req.body.password;
            user.password = newPw;
            var sha1 = crypto.createHash('sha1').update(newPw).digest('hex').toString();
            user.password = sha1;
            user.save();
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
//     const otp1 = req.body.otp1;
//     const newPw = req.body.password;
//     let loadedUser = User.findOne({ _id: req.params.userId })
//     OTP.findOne({ ot: otp1 })
//         .then(otp => {
//             if (!otp) {
//                 const error = new Error('An otp could not be found');
//                 error.statusCode = 401;
//                 res.json({ message: "An otp could not be found" });
//             }
//             loadedUser = user;
//             const newPw = req.body.password;
//             user.password = newPw;
//             res.status(200).json({message:'password updated!!'});
//         })    
    // bcrypt.hash(newPw,12)            
    //         .then(hashedPw =>{
    //             user.password = hashedPw;
    //             newOne = hashedPw;
    //             console.log(hashedPw);
    //             return User.findOne({ _id: req.params.userId })
//             })
//             .then(user => {       
//                 user.password = newOne;
//                 res.status(200).json({ message: 'Password updated!!' });
//                 return user.save();
//             })    
//   User.findOne({_id:req.params.userId})
//             .then(user=>{
//                 const newPw = req.body.password;
//                 user.password = newPw;
//                 var sha1 = crypto.createHash('sha1').update(newPw).digest('hex');
//                 user.password = sha1;
//                 return user.save();
//             })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// };


exports.feedback = (req,res,next)=>{
     const userId = req.params.userId;
     const name = req.body.name;
     const title = req.body.title;
     const message = req.body.message;
     User.findOne({ name: name })
     .then(user => {
        if (!user) {
            const error = new Error('An user with this name could not be found');
            error.statusCode = 401;
            throw error;
        }
        const feedback = new FeedBack({
            title: title,
            message: message
        })
        
        feedback.save();
        user.feedbacks.push(feedback);
        return res.status(200).json({message:'Feedback saved!'});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
};



