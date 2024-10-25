const { createCommentController, getAllComentsController, deleteComentController } = require("../controllers/comment.controller")
const verifyUser = require("../middleware/authVerify")

const express=require("express")
const router=express.Router()

router.post('/',verifyUser, createCommentController)
router.get('/:postId', getAllComentsController)
router.delete('/:commentId',verifyUser, deleteComentController)

//children message
router.post('/:commentId', verifyUser, createCommentController)
router.get('/:postId/:commentId', getAllComentsController)

module.exports=router