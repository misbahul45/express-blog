const errorHandler = require("../utils/error");
const jwt=require('jsonwebtoken')

const verifyUser=async(req, res, next)=>{
    const token=req.cookies?.token
    if(!token){
        return next(errorHandler(401, "unauthorized user"))
    }
    jwt.verify(token, process.env.JWT_SECRET, async(err, payload)=>{
        if(err){
            return next(errorHandler(401, "unauthorized user"))
        }
        req.userId=payload.id
        return next()
    })
}

module.exports=verifyUser