const db = require("../utils/prisma")

const addLikesController=async(req, res, next)=>{
    const authorId=req.userId
    const { commentId }=req.body 
    console.log(commentId, authorId)
    try {
        const like=await db.like.findUnique({
            where:{
                commentId_authorId:{
                    commentId,
                    authorId
                }
            }
        })

        if(like){
            await db.like.delete({
                where:{
                    commentId_authorId:{
                        commentId,
                        authorId,                 
                    }
                }
            })
            return res.json({ success:true })
        }

        await db.like.create({
            data:{  
                authorId,
                commentId
            }
        })
        return res.json({ success:true })
    } catch (error) {
        console.log(error)
        next(error)       
    }
}

const getAllLikesController=async(req, res, next)=>{
    const { commentId }=req.params
    try {
        const likes=await db.like.findMany({
            where:{
                commentId
            },
        })
        return res.json(likes)
    } catch (error) {
        next(error)
    }
}

module.exports={ addLikesController, getAllLikesController }