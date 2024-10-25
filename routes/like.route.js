const express=require("express")
const verifyUser = require("../middleware/authVerify")
const { addLikesController, getAllLikesController } = require("../controllers/like.controller")

const router=express.Router()

router.post('/:commentId', verifyUser, addLikesController)
router.get('/:commentId', getAllLikesController)

module.exports=router