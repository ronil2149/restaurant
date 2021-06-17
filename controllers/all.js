const All = require('../models/all');
const auth = require('../middleware/is-auth');
const Restaurant = require('../models/restaurant'); 
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
const restaurant = require('../models/restaurant');
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
    const restaurantId = req.params.restaurantId;
    const email = req.body.email;
    const phone = req.body.phone;
    const name = req.body.name;
    const password = req.body.password;
    const activerole = req.body.activerole;
    const categoryId = req.body.categoryId;
    const roles = req.body.roles;
    const sha1 = crypto.createHash('sha1').update(password).digest('hex');
    const all = new All({
        name: name,
        email: email,
        phone: phone,
        activerole: activerole,
        categoryId:categoryId,
        restaurantId:restaurantId,
        password: sha1        
    })
    return all.save()
    // Restaurant.findById(restaurantId)
    // .then(restaurant =>{
    //     if(!restaurant){
    //         const error = new Error('There are no such restaurants')
    //         error.statusCode = 404;
    //         throw error;
    //     }
    //     else{
    //         const all = new All({
    //             name: name,
    //             email: email,
    //             phone: phone,
    //             activerole: activerole,
    //             restaurantId:restaurantId,
    //             password: sha1        
    //         })
    //         return all.save();
    //         }       
    // })
    .then(all=>{
        return res.status(201).json({ message: 'Registered sucessfully', Id: all._id });
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
    let loadedActiverole;

    All.findOne({  email: email  })
        .then(all => {
            if (!all) {
                const error = new Error('mmm...somthing seems wrong here!!  you sure,you added the right credentials?');
                error.statusCode = 401;
                throw error;
            }
            else if (all.activerole == 'user'){
                loadedAll = all;
                loadedActiverole = all.activerole;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome User',role:loadedActiverole, your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
            else if (all.activerole == 'cook'){
                loadedAll = all;
                loadedActiverole = all.activerole;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, categoryId : loadedAll.categoryId, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name,categoryId : loadedAll.categoryId, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome Cook',role:loadedActiverole, your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
            else if (all.activerole == 'waiter'){
                loadedAll = all;
                loadedActiverole = all.activerole;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome Waiter',role:loadedActiverole, your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
            else if (all.activerole == 'manager'){
                loadedAll = all;
                loadedActiverole = all.activerole;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome Manager',role:loadedActiverole, your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
                    return loadedAll;
            }}
            else if (all.activerole == 'admin'){
                loadedAll = all;
                loadedActiverole = all.activerole;
                var sha1 = crypto.createHash('sha1').update(password).digest('hex');
                let accessToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretaccesstoken', { expiresIn: "86400s" });
                let refreshToken = jwt.sign({ email: loadedAll.email,name:loadedAll.name, phone: loadedAll.phone, Id: loadedAll._id.toString() }, 'somesupersecretrefreshtoken', { expiresIn: "7d" })            
                
                if (sha1 == all.password) {
                    accessTokens.push(accessToken);
                    console.log(accessTokens);
                    res.status(200).json({message:'Welcome Admin',role:loadedActiverole, your_accessToken: accessToken,your_refreshToken: refreshToken, Id: loadedAll._id.toString()});
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
                err.statusCode = 500;e
            }
            next(err);
        });
}


exports.forgot = (req, res, next) => {    
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
                res.status(200).json({ message: `mail has been sent to ${email}`, creator: { _id: creator._id } });
                return all.save();
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
};

exports.reset = (req, res, next) => {
    const newPw = req.body.password;
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    const  email = req.body.email;
    const otp1 = req.body.otp1;
    OTP.findOne({ ot: otp1 })
        .then(ot => {
            if (!ot) {
                const error = new Error('An otp could not be found');
                error.statusCode = 404;
                res.json({ message: "An otp could not be found" });
            }
            else{
                return All.findOne({ email : email})
            }
        })    
        .then(all => {
            if(!all){
                res.status(401).json({ message: 'An admin with this email could not be found' });
            }
            else
            {const newPw = req.body.password;
            all.password = newPw;
            var sha1 = crypto.createHash('sha1').update(newPw).digest('hex').toString();
            all.password = sha1;
            all.save();
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


exports.getSomeone = (req,res,next) =>{
    const activerole = req.body.activerole;
    const CurrentPage = req.query.page || 1;
    const perPage = 10;
    let totalPersons;
    All.find({activerole:activerole})
    .countDocuments()
    .then(count => {
      totalPersons = count;
      return All.find({activerole:activerole})
        .skip((CurrentPage - 1) * perPage)
        .limit(perPage)
    })
        .then(all=>{
            if(!all){
                return res.status(404).json({message:"There are no person!!"});
            }
            else if(activerole == ""){
                return res.status(404).json({message:"There are no person with such roles"});
            }
            else{
                return res.status(200).json({message:"Here is the list you asked for..", list:all, totalPersons : totalPersons});
            }           
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


exports.UpdateRole = (req,res,next) =>{
    const activerole = req.body.activerole;
    // let token = req.headers['authorization'];
    // token = token.split(' ')[1];
    const email = req.body.email;
    All.findOne({email})
    .then(all=>{
        if(!all){
            return res.status(400).json({message:'There are no such person !!!'});
        }
        all.activerole = activerole;
        if(all.roles.includes(activerole)){
            return res.status(500).json({message:'You already have that role'});
        }
        else{
            all.roles.push(activerole);
            return all.save();
        }
    })
    .then(result =>{
        return res.status(200).json({message:"Role updated successfully", UpdatedRole : result})
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.SwitchRole = (req,res,next) =>{
    const activerole = req.body.activerole;
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    All.findOne({email})
    .then(all=>{
        if(!all){
            return res.status(400).json({message:'There are no such person !!!'});
        }        
        console.log(all.roles);
        if(all.roles.includes(activerole)){
            all.activerole = activerole;
            all.save();
            return res.status(200).json({message:`You are ${activerole} from now on.!`, result:all});
        }
        else{            
            return res.status(404).json({message:'You do not have this role in your possession !!!'});
        }
    })
    .then(result =>{
        return res.status(200).json({message:"Role updated successfully", UpdatedRole : result})
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })       

}


exports.GetEveryone = (req,res,next) =>{
        const CurrentPage = req.query.page || 1;
        const perPage = 100;
        let totalPersons;
        All.find()
          .countDocuments()
          .then(count => {
            totalPersons = count;
            return All.find()
              .skip((CurrentPage - 1) * perPage)
              .limit(perPage)
          })
          .then(all => {
            res.status(200)
              .json({
                message: 'Fetched everyone Successfully',
                persons: all,
                totalPersons: totalPersons
              });
          })
          .catch(err => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
}



exports.DeleteSomeone = (req,res,next) =>{
    const allId = req.params.allId;
    All.findByIdAndDelete(allId)
        .then(all=>{
            if(!all){
                const error= new Error('There are no such persons');
                error.statusCode = 404;
                throw error;
            }
            else{
                all.remove();
                return res.status(200).json({message:"Deleted successfully :) ",  RemovedPerson:all});
            }
        })
        .catch(err => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });

}

exports.DeactivateSomeone = (req,res,next) =>{

    const allId = req.params.allId;

    All.findById(allId)
    .then(all=>{
        if(!all)
        {
            const error = new Error('There are no such persons!!');
            error.statusCode = 404;
            throw error;
        }
        else{
            all.active = false;
            all.deactivatedAt = Date.now();
            all.save();
            return res.json({message:"This person has been deactivated !", person:all})
        }
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}

exports.ActivateSomeone = (req,res,next) =>{
    const allId = req.params.allId;
    All.findById(allId)
    .then(all=>{
        if(!all)
        {
            const error = new Error('There are no such persons!!');
            error.statusCode = 404;
            throw error;
        }
        else{
            all.active = true;
            all.activatedAt = Date.now();
            all.save();
            return res.json({message:"This person has been activated !", person:all})
        }
    })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}


exports.UpdateSomeone = (req,res,next) =>{
    const email = req.body.email;
    const allId = req.params.allId;
    const phone = req.body.phone;
    const name = req.body.name;
    const categoryId = req.body.categoryId;

    All.findById(allId)
    .then(all=>{
        if(!all)
        {
            const error = new Error('There are no such persons!!');
            error.statusCode = 404;
            throw error;
        }
        else{
            all.email = email;
            all.phone = phone;
            all.categoryId = categoryId;
            all.name = name;
            all.save();
            return res.json({message:"Data of this person has been updated !", person:all})
        }
    }).catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
          return err;
        }
        next(err);
      });
    
}