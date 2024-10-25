const { Router } = require("express");
const { createPostController, getAllPostsController, getPostController, deletePostController, getCommentsByUserPosts, updatePostController } = require("../controllers/post.controller");
const verifyUser = require("../middleware/authVerify");
const { createPostMiddleware } = require("../middleware/postMiddleware");
const router=Router()

router.get('/', getAllPostsController)
router.get('/comments', verifyUser, getCommentsByUserPosts)
router.get('/:slug',getPostController)
router.post("/", verifyUser, createPostMiddleware, createPostController)
router.patch('/:postId', verifyUser, updatePostController)
router.delete('/:postId', verifyUser, deletePostController)

module.exports=router