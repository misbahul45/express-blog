const { hashPassword, checkPassword } = require("../utils/bcryptConfig")
const errorHandler = require("../utils/error")
const db = require("../utils/prisma")
const jwt=require('jsonwebtoken')

const signUpController=async(req,res, next)=>{
    const data=req.body
    try {
        const hashedPassword=await hashPassword(data.password)
        const newUser=await db.user.create({
            data:{
                ...data,
                password:hashedPassword
            }
        })
        return res.json({ success:true, message:"Success create user with name "+newUser.username })
    } catch (error) {
       next(errorHandler(400, "username or email has been used"))
    }
}


const signInController=async(req,res, next)=>{
    const { data, password }=req.body
    try {
        const findUser=await db.user.findFirst({
            where:{
                OR:[
                    { username:data },
                    { email:data }
                ]
            
            }
        })

        if(!findUser){
            return next(errorHandler(400, "user not found"))
        }
        const isMatch=await checkPassword(password, findUser.password)
    
        if(!isMatch){
            return next(errorHandler(400, "invalid password user"))
        }
        const token=jwt.sign(
            { id:findUser.id },
            process.env.JWT_SECRET,
        )
        const { password:pass, ...rest }=findUser
        return res.cookie("token", token, {
            httpOnly:true
        }).json({ success:true, user:rest })
    } catch (error) {
        next(error)
    }
}

const authByGoogleController=async(req, res, next)=>{
    const { email, username, avatar }=req.body
    try {
        const findUser=await db.user.findFirst({
            where:{
                OR:[{ username },{ email }]
            }
        })
        if(!findUser){
            //sign up
            const createUser=await db.user.create({
                data:{
                    username,
                    email,
                    avatar
                }
            })
            const tokenSignUp=jwt.sign(
                { id:createUser.id },
                process.env.JWT_SECRET,
            )
            return res.cookie("token", tokenSignUp, {
                httpOnly:true
            }).json({ success:true, user:createUser })
        }

        //sign in
        const token=jwt.sign(
            { id:findUser.id },
            process.env.JWT_SECRET,
        )
        const { password, ...rest }=findUser
        return res.cookie("token", token, {
            httpOnly:true
        }).json({ success:true, user:rest })

    } catch (error) {
        next(error)   
    }

}

const signoutUserController=async(_, res)=>{
    return res.cookie("token",'').json({
        message:"User Successfully Sign Out"
    })
}

module.exports={ signUpController, signInController, authByGoogleController, signoutUserController }