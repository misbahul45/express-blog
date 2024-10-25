const errorHandler = require("../utils/error")

function convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
}

const createPostMiddleware=(req, res, next)=>{
    const { title, category, desc, authorId }=req.body
    if(!title || !category || !desc || !authorId ){
        next(errorHandler(401, "Please input all fields"))
    }
    const slug=convertToSlug(title)
    req.postSlug=slug
    next()
}



module.exports={ createPostMiddleware }