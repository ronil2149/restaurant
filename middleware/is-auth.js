const jwt = require('jsonwebtoken');
const express = require('express');

exports.auth = (req,res,next)=>{
    let token = req.headers['authorization'];
    token = token.split(' ')[1];

    if(!token){
        const error = new Error('Token is not found ')
        error.statusCode  = 404;
        next(err);
    }

    jwt.verify(token , 'somesupersecretaccesstoken',(err,user)=>{
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json({message:'User is not authenticated'});
        }
    })
}
