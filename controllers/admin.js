const Admin = require('../models/admin');
const admin = require('../models/admin');
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

exports.addAdmin = (req, res, next) => {
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
    const admin = new Admin({
        name: name,
        email: email,
        phone: phone,
        password: sha1
    })
    return admin.save()
        .then(result => {
            res.status(201).json({ message: 'Admin created', adminId: admin._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.adminlogin = (req, res, next) => {
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    let loadedAdmin;

    Admin.findOne({ $or: [{ email: email }] })
        .then(admin => {
            if (!admin) {
                const error = new Error('An admin with this email  not found .');
                error.statusCode = 401;
                throw error;
            }
            var sha1 = crypto.createHash('sha1').update(password).digest('hex');
            console.log(sha1);
            loadedAdmin = admin;
            if (sha1 == admin.password) {
                return loadedAdmin;
            }
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            let accessToken = jwt.sign({ email: loadedAdmin.email, phone: loadedAdmin.phone, adminId: loadedAdmin._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "200s" });
            let refreshToken = jwt.sign({ email: loadedAdmin.email, phone: loadedAdmin.phone, adminId: loadedAdmin._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })
            refreshTokens.push(refreshToken);
            console.log(refreshTokens);
            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken, adminId: loadedAdmin._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}



exports.Adminforgot = (req, res, next) => {
    // const user = User.findById({ _id: req.params.userId });    
    const userId = req.params.userId;
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, Number: true, alphabets: false });
    const email = req.body.email;
    let creator;
    let loadedUser;
    const ot = new OTP({
        ot: otp,
        creator: Admin._id,
        date: new Date()
    });
        Admin.findOne({ email: email })
            .then(admin => {
                if (!admin) {
                    const error = new Error('An admin with this email could not be found');
                    error.statusCode = 401;
                    res.status(401).json({ message: 'An admin with this email could not be found' });
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
               
                return Admin.findOne({ email: email });
            })
            .then(admin => {
                creator = admin;
                admin.otps.push(ot);
                res.status(200).json({ message: 'your otp:', otp: otp, creator: { _id: creator._id } });
                return admin.save();
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
};

exports.adminreset = (req, res, next) => {
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
                return Admin.findOne({ email : email})
            }
        })    
        .then(admin => {
            if(!admin){
                res.status(401).json({ message: 'An admin with this email could not be found' });
            }
            else
            {const newPw = req.body.password;
            admin.password = newPw;
            var sha1 = crypto.createHash('sha1').update(newPw).digest('hex').toString();
            admin.password = sha1;
            admin.save();
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