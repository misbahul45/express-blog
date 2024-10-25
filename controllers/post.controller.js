const errorHandler = require("../utils/error")
const db = require("../utils/prisma")

const createPostController=async(req, res, next)=>{
    const slug=req.postSlug
    const newPost=req.body
    try {
        await db.post.create({
            data:{
                ...newPost,
                slug
            }
        })
        return res.json({ success:true, message:`Successfully created post` })
    } catch (error) {
        next(errorHandler(error))
    }
}

const getAllPostsController = async (req, res, next) => {
    const search = req.query.search;
    const searchType = req.query.title;
    const authorId=req.query.authorId
    const page = Number(req.query.page) || 1;
    const pageSize = 5;
  
    try {
      const allPosts = await db.post.findMany({
        orderBy: {
          upvotes:{
            _count:'desc'
          },
        },
        where: {
          authorId,
          title: {
            contains: searchType === "all" ? undefined : searchType,
            mode: "insensitive",
          },
          category: {
            contains: search === 'all' ? undefined : search,
            mode: "insensitive",
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return res.json(allPosts);
    } catch (error) {
      next(error);
    }
  };

const getPostController=async(req, res, next)=>{
    const slug=req.params.slug
    try {
        const post=await db.post.findUnique({
            where:{
                slug
            }
        })
        return res.json(post)
    } catch (error) {
        next(errorHandler(error))
    }
}
const deletePostController = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  
  try {
    const post = await db.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return next(errorHandler('Post not found', 404));
    }

    if (post.authorId !== userId) {
      return next(errorHandler('You cannot delete this post', 403));
    }

    await db.post.delete({
      where: { id: postId }
    });

    return res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);

  }
};

const getCommentsByUserPosts = async (req, res, next) => {
  const userId=req.userId
  try {
    const comments = await db.comment.findMany({
      where: {
        post: {
          authorId: userId
        }
      },
      include: {
        post: true,
      }
    });
    return res.json(comments || []);
  } catch (error) {
    console.log(error)
    next(error);
  }
};


const updatePostController=async(req, res, next)=>{
    const postId=req.params.postId
    const userId=req.userId

    try {
      const post=await db.post.findUnique({
        where:{
            id:postId
        }
      })

      if(!post){
        return next(errorHandler('Post not found', 404))
      }

      if(post.authorId!==userId){
        return next(errorHandler('You cannot update this post', 403))
      }

      const updatedPost=await db.post.update({
        where:{
            id:postId
        },
        data:{
            ...req.body
        }
      })
      return res.json({ success: true, message: 'Post updated successfully', data: updatedPost })
    } catch (error) {
      next (error)
    }
}

  
module.exports={ createPostController, getAllPostsController, getPostController, deletePostController, getCommentsByUserPosts, updatePostController }