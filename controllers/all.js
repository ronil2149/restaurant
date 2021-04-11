var All = require('../models/all');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const otpTool = require("otp-without-db");
const key = "supersecretKey";
const OTP = require('../models/otp');
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
let accessTokens = [];


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
    const activerole = req.body.activerole;
    // const array = ["user","admin","cook","waiter","manager"];
    const sha1 = crypto.createHash('sha1').update(password).digest('hex');
    const all = new All({
        name: name,
        email: email,
        phone: phone,
        activerole: activerole,
        password: sha1        
    })
    // if(activerole != array){
    //     return res.status(401).json({message:"There are no such roles in here!!!"});
    // }
    return all.save()
        .then(all => {
            res.status(201).json({ message: 'Registered sucessfully', Id: all._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
                return res.status(500).json({message:"mmm...somthing seems wrong here!!  you sure,you added the right credentials?"})
            }
            next(err);
        })
};


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedAll;

    All.findOne({  email: email  })
        .then(all => {
            if (!all) {
                const error = new Error('mmm...somthing seems wrong here!!  you sure,you added the right credentials?');
                error.statusCode = 401;
                throw error;
            }
            else if (all.activerole == 'user'){
                loadedAll = all;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome User', your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
            else if (all.activerole == 'cook'){
                loadedAll = all;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome Cook', your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
            else if (all.activerole == 'waiter'){
                loadedAll = all;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome Waiter', your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
            else if (all.activerole == 'manager'){
                loadedAll = all;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome Manager', your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
            else if (all.activerole == 'admin'){
                loadedAll = all;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome Admin', your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


exports.forgot = (req, res, next) => {
    // const user = User.findById({ _id: req.params.userId });    
    const userId = req.params.userId;
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, Number: true, alphabets: false });
    const email = req.body.email;
    let creator;
    let loadedAll;
    const ot = new OTP({
        ot: otp,
        creator: All._id,
        date: new Date()
    });
        All.findOne({ email: email })
            .then(all => {
                if (!all) {
                    const error = new Error('No one with this email exists in database');
                    error.statusCode = 404;
                    res.status(404).json({ message: 'No one with this email exists in database' });
                }
              else{  transporter.sendMail({
                    to: email,
                    from: 'hello-here.com',
                    subject: 'RESET here!!!',
                    html: ` <p>Your OTP  ${otp}</p>
                <p>For password reset click</p>      
                <a href = http://192.168.29.121:3000/admin-reset here>here</a></p>`
                })
                 ot.save();
            }               
                return All.findOne({ email: email });
            })
            .then(all => {
                creator = all;
                all.otps.push(ot);
                res.status(200).json({ message: 'your otp:', otp: otp, creator: { _id: creator._id } });
                return all.save();
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
};