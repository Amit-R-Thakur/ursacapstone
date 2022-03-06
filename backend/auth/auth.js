const auth = require("../models/userSchema");
const course=require("../models/course.schema")
const Otp=require("../models/otpSchema")
const validator = require("validator");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const {loadUser}=require("../controllers/loaduser")
const { default: isEmail } = require("validator/lib/isEmail");
const {smsOtpSend} =require("../controllers/otpSender")
require("dotenv").config()
var unirest = require("unirest");


// method 1 for send sms
// const Vonage = require('@vonage/server-sdk')
// const vonage = new Vonage({
//   apiKey: "463897cd",
//   apiSecret: "GyPw7OSqWkAsyvVU"
// })
// const from = "Vonage APIs"
// const to = `91${emailOrMobile}`
// const text = `Your Otp is ${otp}`

// vonage.message.sendSms(from, to, text, (err, responseData) => {
//     if (err) {
//         console.log(err);
//     } else {
//         if(responseData.messages[0]['status'] === "0") {
//             console.log("Message sent successfully.");
//         } else {
//             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//         }
//     }
// })
exports.addProfile = async (req, res) => {
  try {
    const { fullname, email, mobile, password, role,course } = req.body;
    console.log(req.body);
    if (!fullname || !email || !mobile  || !role)
      return res.status(400).send("all field is required!");
    else if (!validator.isEmail(email))
      return res.status(400).send("invalid email!");
    else if (!validator.isMobilePhone(mobile, "en-IN"))
      return res.status(400).send("invalid mobile!");
    const user=new auth({fullname, email, mobile, password, role,course})
    console.log(user.role)
    if(user.role!="admin"&&user.role!="teacher"&&user.role!="student")
    return res.status(400).send("role is not valid!")
    const theUser=await user.save()
    res.status(200).send("User Created!")
    console.log(theUser);
  } catch (err) {
    console.log(err)
    const splitedErr = err.message.split(" ");
    if (splitedErr[11] == "email:" || splitedErr[11] == "mobile:")
      res.status(400).send("existing user with given email or mobile");
  }
};

exports.adminSignIn=async(req,res)=>{
    try{
        const {email,password}=req.body
        let dataToSend={}
        if(!email||!password)
        res.status(400).send("fill the field!")
        else if(!validator.isEmail(email))
        return res.status(400).send("invalid email")
        const isValidUser=await auth.findOne({}).where({email})
        if(!isValidUser||isValidUser.role!="admin")
        return res.status(400).send("invalid details!")
        if(!await bcrypt.compare(password,isValidUser.password))
        return res.status(400).send("invalid details!")
        dataToSend=await loadUser(isValidUser._id)
        res.status(200).send(dataToSend)
    }
    catch(err){
        console.log(err)
        res.status(400).send("Something went wrong!")
    }
}




// Teachet login with otp!!!

exports.sendOtp=async(req,res)=>{
  try{
    let otp;
    const {emailOrMobile}=req.body
    if(!validator.isEmail(emailOrMobile)&&!validator.isMobilePhone(emailOrMobile,"en-IN"))
    return res.status(400).send("invalid email or mobile!")
    if(validator.isEmail(emailOrMobile)){
     const isUser=await auth.findOne({email:emailOrMobile}) 
     if(!isUser||isUser.role=="admin")
     return res.status(400).send("email is not registered!")
    otp=Math.floor((Math.random() * 10000) + 1);
    console.log(otp)
    const otpToSave=new Otp({user:isUser._id,otp})
    const theSavedOtp=await otpToSave.save()
    if(!theSavedOtp)
    return res.status(400).send("Somthing went wrong!")
 

    const authToken=await jwt.sign({userId:isUser._id,otpId:theSavedOtp._id},process.env.SECRETKEYFORTOKEN,{expiresIn:120})

    return res.status(200).send({msg:`OTP has been sent to your Email ${emailOrMobile}  `,verifyToken:authToken})

  }
    if(validator.isMobilePhone(emailOrMobile,"en-IN")){
      return res.status(400).send("we are working on it!")
      const isUser=await auth.findOne({mobile:emailOrMobile}) 
      if(!isUser)
      return res.status(400).send("please enter email we are working on it!")
     otp=Math.floor((Math.random() * 10000) + 1);
     console.log(otp)
     const otpToSave=new Otp({user:isUser._id,otp})
     const theSavedOtp=await otpToSave.save()
     if(!theSavedOtp)
     return res.status(400).send("Somthing went wrong!")
    //  sending otp
    const isMsg=await smsOtpSend(otp,emailOrMobile)
    if(!isMsg)
    return res.status(400).send("Somthing went wrong")
     const authToken=await jwt.sign({userId:isUser._id,otpId:theSavedOtp._id},process.env.SECRETKEYFORTOKEN,{expiresIn:120})
     console.log(authToken)
     return res.status(200).send({msg:`OTP has been sent to your Mobile ${emailOrMobile}  `,verifyToken:authToken})
  }

  }
  catch(err){
    console.log(err)
    return res.status(400).send("Somthing went wrong!")

  }
}


// Verify otp...........

exports.otpVerify=async(req,res)=>{
  try{
    const {otp}=req.body
    console.log(otp)
    const isValidAuthToken=await jwt.verify(req.params.verifyToken,process.env.SECRETKEYFORTOKEN)
    if(!isValidAuthToken)
    return res.status(400).send("Otp is Expired!")
    const {userId,otpId}=isValidAuthToken
    if(!userId||!otpId)
    return res.status(400).send("Otp is Expired!")
    const theUser=await auth.findById(userId)
    if(!theUser)
    return res.status(400).send("Otp is Expired!")
    const theOtp=await Otp.findById(otpId)
    if(!theOtp)
    return res.status(400).send("Otp is Expired!")
    const isValidOtp=await bcrypt.compare(otp,theOtp.otp)
    if(!isValidOtp)
    return res.status(400).send("Invalid Otp!")
    let dataToSend=await loadUser(userId)
    return res.status(200).send({msg:"verified!",user:dataToSend})

  }
  catch(err){
    console.log(err)
    return res.status(400).send("Otp is Expired!")
  }

}

