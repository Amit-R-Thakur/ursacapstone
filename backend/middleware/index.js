const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
require("dotenv").config()
exports.AdminAndTeacherMiddleware=async(req,res,next)=>{
    try{
     const verifytoken = req.headers.authorization;
     if(!verifytoken)
     return res.status(400).send("token is required!")
     const isValidToken=await jwt.verify(verifytoken,process.env.SECRETKEY)
     const {id}=isValidToken
     const theUser=await User.findById(id)
     if(!theUser)
     return res.status(400).send("invalid user!")
     if(theUser.role=="teacher"||theUser.role=="admin"){
        req.role=theUser.role
        req._id=theUser._id
        next();
     }
    }
    catch(err){
        console.log(err)
        return res.status(400).send("Something went wrong!")

    }
}


exports.verifyadmin = async (req,res,next)=>{
    try{
        const verifytoken = req.headers.authorization;
          if(!verifytoken){
             res.status(401).json("token is required");
              }
          else{
          const data = await jwt.verify(verifytoken,process.env.SECRETKEY)
            const { id } = data
            console.log(data);
         const user = await User.findById(id) ;
         if(user){
             const { role } = user
            if(role == "admin"){
                next();
            }
            else{
                res.status(400).json("only admin can access it");
            }
         } 
       }
    }
    catch(err){
        res.status(400).json(err);
    }
}