const bcryptjs=require("bcryptjs")


const hashPassword=async(password)=>{  
    const salt=await bcryptjs.genSalt(10)
    const hashedPassword=await bcryptjs.hash(password,salt)
    return hashedPassword
}


const checkPassword=async(password,hashedPassword)=>{
    return await bcryptjs.compare(password,hashedPassword)
}

module.exports={ hashPassword, checkPassword }