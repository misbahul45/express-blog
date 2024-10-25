const express=require("express")
const verifyUser = require("../middleware/authVerify")
const { updateUserController, deleteUserController, getUserController, uproveUserController, getUpprovesController } = require("../controllers/user.controller")

const router=express.Router()

router.get('/:userId', getUserController)
router.patch('/update/:userId', verifyUser, updateUserController)
router.delete('/delete', verifyUser, deleteUserController)

//upprove
router.get('/upprove/:postId', verifyUser,getUpprovesController)
router.post('/upprove', verifyUser, uproveUserController)


module.exports=router