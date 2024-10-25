const db = require("../utils/prisma")

const createCommentController=async(req, res, next)=>{
    const { comment, postId, authorId, parentId }=req.body
    try {
        await db.comment.create({
            data:{
                message:comment,
                postId,
                authorId,
                ...( parentId && { parentId })
            }
        })
        return res.json({ success:true })
    } catch (error) {
        next(error)   
    }

}

const getAllComentsController=async(req, res, next)=>{
    const { postId, commentId }=req.params
    try {
        const comments=await db.comment.findMany({
            where:{
                postId:postId,
                parentId:commentId
            },
            orderBy:{
                createdAt:'desc'
            }
        })
        
        const sendBackComments=comments.filter((comment)=>commentId?true:!comment.parentId)
        return res.json(sendBackComments)
    } catch (error) {
        next(error)
    }
}

const deleteComentController = async (req, res, next) => {
    const { commentId } = req.params;
    try {
        // Mengupdate child comments untuk menghapus referensi parent
        await db.comment.updateMany({
            where: {
                parentId: commentId
            },
            data: {
                parentId: null
            }
        });

        // Hapus parent comment
        await db.comment.delete({
            where: {
                id: commentId
            }
        });

        return res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports={ createCommentController, getAllComentsController, deleteComentController, }