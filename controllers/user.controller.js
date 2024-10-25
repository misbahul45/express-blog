const { hashPassword } = require("../utils/bcryptConfig")
const db = require("../utils/prisma")
const errorHandler = require("../utils/error");

const updateUserController=async(req, res, next)=>{
    const { userId }=req.params
    const { password:updatePassword, username, email, avatar }=req.body 
     
    if(!username && !email){
        return next(errorHandler(400, "username and email are required"))
    }
    let hashedPassword=''
    if(updatePassword){
        hashedPassword=await hashPassword(updatePassword)
    }

    try {       
        const findUser=await db.user.findUnique({
            where:{
                id:userId
            },
        })

        const updatedUser=await db.user.update({
            where:{
                id:userId
            },
            data:{
            ...( updatePassword && { password:hashedPassword }),
            ...(username!==findUser.username && { username }),
            ...(email!==findUser.email && { email }),
            ...(avatar && { avatar })
            }
        })
        const { password:_, ...rest }=updatedUser
        return res.json({ success:true, user:rest })
    } catch (error) {
        next(error)
    }
}

const deleteUserController=async(req,res, next)=>{
    const userId=req.userId
    try {
        const deleteUser=await db.user.delete({
            where:{
                id:userId
            }
        })
        return res.cookie("token","").json({ succes:true, message:'Success to deleted user with name'+deleteUser })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getUserController=async(req, res, next)=>{
    const userId=req.params.userId
    try {
        const user=await db.user.findUnique({
            where:{
                id:userId
            },
            select:{
                id:true,
                username:true,
                email:true,
                avatar:true
            }
        })
        return res.json({ ...user })
    } catch (error) {
        next(error)
    }
}


const uproveUserController=async(req, res, next)=>{
    const userId=req.userId
    const postId=req.body.postId
    try {
        const isUpprove=await db.upprove.findUnique({
            where:{
                postId_userId:{
                    postId,
                    userId
                }
            }
        })
        if(isUpprove){
            await db.upprove.delete({
                where:{
                    postId_userId:{
                        postId,
                        userId
                    }
                }
            })
            return res.json({ success:true, message:'Success to delete upprove' })
        }

        await db.upprove.create({
            data:{
                postId,
                userId
            }
        })
        return res.json({ success:true, message:'Success to upprove' })
    } catch (error) {
        next(error)
    }
}

const getUpprovesController=async(req, res, next)=>{
     const userId=req.userId
     const postId=req.params.postId
    try{
        const isUpprove=await db.upprove.findUnique({
            where:{
                postId_userId:{
                    postId,
                    userId
                }
            }
        })

        if(isUpprove){
            return res.json({ success:true, isUpprove:true })
        }
        return res.status(401).json({ success:false, isUpprove:false })
    }catch(error){
        next(error)
    }
}


module.exports={ updateUserController, deleteUserController, getUserController, uproveUserController, getUpprovesController }