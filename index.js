const express=require("express")
const cookieParser = require('cookie-parser');

const userRouter=require("./routes/user.route")
const authRouter=require("./routes/auth.route")
const postRouter=require('./routes/post.route')
const commentRouter=require('./routes/comment.route')
const likeRouter=require('./routes/like.route')

//configuration
const app=express()
const PORT=process.env.PORT
app.use(express.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/',(req, res)=>{
    res.json({message:"hello world"})
})
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use('/api/comments',commentRouter)
app.use('/api/likes',likeRouter)

app.listen(PORT,()=>{
    console.log("backend server is running on port",PORT)   
})

module.exports = app;



app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500
    const message=err.message || "Internal Server Error"
    res.status(statusCode).json({
        success:false,
        status:statusCode,
        message:message,
    })
})