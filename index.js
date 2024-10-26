const express = require("express");
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors')

// Use proper path resolution for routes
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const postRouter = require('./routes/post.route');
const commentRouter = require('./routes/comment.route');
const likeRouter = require('./routes/like.route');

const app = express();

app.use(cors())

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files with absolute path
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);

// Add a root route handler
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    });
});

// Export the Express app
module.exports = app;

// Optional: Use Vercel's serverless function support
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}