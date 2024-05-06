const express = require("express");
const user = require("../../models/userModel");
const bcrypt = require("bcrypt");
const book = require("../../models/bookModel");
const category = require("../../models/categoryModel")
const twilio = require("../../middlewares/twilio");
const { authenticate } = require("passport");
const sendMail = require("../../middlewares/nodmailer")


async function hashedPass(password) {
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

// User registration page
const viewRegister = (req, res, next) => {
    let user = 0
    let userNameExistErr= 0
    let emailExistErr = 0
    res.render("user/signup",{layout:"user/layouts",currentUser:0,user:user,userNameExistErr,emailExistErr});
};

const registerUser = async (req, res, next) => {
    try {
        const pass = await hashedPass(req.body.password);
        const data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: pass,
        };

        console.log(data);

        const checking = await user.findOne({ email: req.body.email });
        if (checking) {
            res.render("user/signup", { message: "User with the same email exists" ,currentUser:0,userNameExistErr:0,emailExistErr:1});
        } else {
            req.session.details = data
            twilio.sendOtp();
            req.session.email = req.body.email
            res.render("otp");
        }
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal server error");
    }
};

// user otp controller

const resendOtp = async function(req,res){
    twilio.sendOtp()
    res.render("otp")
}

const postOtp = async function(req,res,next){

    try{
    let otp = await req.body.otp
    let checking = await twilio.verifyOtp(otp)
        console.log(checking);
        if(checking){
            let data =await req.session.details
            console.log("user data : ",data);
            await user.insertMany([data])
            req.session.isAuthenticated = true
            delete req.session.data
            let currentUser = null;
            let loginErr = null;
            let verifyErr = null;
            let blockErr = null;
            let updatePass = null;
    console.log("user ");
    res.render("user/login",{currentUser,loginErr,verifyErr,blockErr,updatePass});        }
        else{            
            res.render("otp",{message:"wrong otp"})
        }
    }
    catch(err){
        console.log(err.message);
    }
    
}
const viewOtp = async function(req,res,next){
    res.render("otp")
}


// User login page
const viewLogin = (req, res, next) => {
    console.log(req.session.userid);
    if(req.session.userid=="undefined"){
        console.log("no user");
        let currentUser = null;
        let loginErr = null;
        let verifyErr = null;
        let blockErr = null;
        let updatePass = null;
        res.render("user/login",{currentUser,loginErr,verifyErr,blockErr,updatePass});


    }
    let currentUser = null;
        let loginErr = null;
        let verifyErr = null;
        let blockErr = null;
        let updatePass = null;
    console.log("user ");
    res.render("user/login",{currentUser,loginErr,verifyErr,blockErr,updatePass});
};


const postLogin = async (req, res, next) => {
    try {
        const email1 = req.body.email;
        const password1 = req.body.password;
        const userOne = await user.findOne({ email: email1 });
        


        if (userOne) {
            let status= userOne.status;
            if(status){
                const checking = await bcrypt.compare(password1, userOne.password);
                if (checking) {
                    req.session.user = true;
                    req.session.userid = userOne._id;
                    let currentUser = userOne || null
                    
                    res.redirect("/home")
                }
            
                else {
                    let currentUser = userOne || null
                    res.render("user/login", { message: "Wrong credentials",currentUser});
                }
            }else {
                let currentUser = userOne || null
            res.render("user/login", { message: "User is blocked",currentUser});
        }}
        else{
            let currentUser = userOne || null
            res.render("user/login", { message: "User not found",currentUser});
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error"); // Handle the error gracefully
    }
};

// user google authentication 
const successGoogleLogin = (req , res) => { 
	if(!req.user) 
		res.redirect('/failure'); 
    console.log(req.user);
	res.render("index",{message:req.user.displayName}) 
}

const failureGoogleLogin = (req , res) => { 
	res.send("Error"); 
}

// User home page
const userHome =async (req, res, next) => {
    let id = req.session.userid
    let userexist = await user.findOne({_id:id})
    let currentUser = userexist?user:0
    console.log(currentUser);
    let banners =0
    let products = await book.find().lean()
    // console.log(products[0].name);
    let SignupMess = 0
    res.render("user/home",{banners,products,SignupMess,currentUser});
};

// post riview 

const postReview = async function(req,res,next){
    try{
        let id =await req.params.id
    let msg = await req.body.name
    let categories = await category.find()
    let selectedBook = await book.findOne({_id:id})
    console.log(selectedBook);
    let ans = await selectedBook.reviews.push(msg)
    await selectedBook.save()
    console.log(ans);
    let books = await book.findOne({_id:id})
    res.render("userBookDetails",{data:books,data2:categories})
    }
    catch(err){
        console.log(err);
    }
    
}

// user forget password 

const viewEmail = function(req,res,next){
    let wrong = null
    res.render("forgotpass",{wrong})
}
const postmail = async function(req,res,next){
    console.log("forgot pass email posted");
    let USERMAIL = req.body.email
    let ckecking = await user.findOne({email:USERMAIL}).lean()
    console.log(ckecking);
    let userId = ckecking._id
    if(ckecking){
        let otp = Math.floor(100000 + Math.random() * 900000);
        req.session.email = USERMAIL
        req.session.otp = otp
        req.session.user = ckecking._id
        
    await sendMail(USERMAIL,otp).catch(console.error);
    let forget = 1
    res.render("otpValid",{forget,userId,email:USERMAIL})
    }
    else{
        let wrong = 1
        res.render("forgotpass",{wrong})
    }
    


}

const resendEmailOtp = async function(req,res){
    let USERMAIL = req.session.email
    let ckecking = await user.findOne({email:USERMAIL}).lean()
    console.log(ckecking);
    if(ckecking){
        let otp = Math.floor(100000 + Math.random() * 900000);
        req.session.otp = otp
        req.session.user = ckecking._id
    await sendMail(USERMAIL,otp).catch(console.error);
    res.render("resetOtp")
    }
    else{
        res.render("enterEmail",{message:"user with this email does not exist"})
    }
}

const viewResetOtp = function(req,res,next){
    res.render("resetOtp")
}
const postResetOtp =async function(req,res,next){
    let enterOtp = await req.body.otp
    let sendOtp = await req.session.otp
    if(enterOtp==sendOtp){
        let currentUser = await user.findOne({_id:req.session.user})
        res.render("newpassword",{userId:req.session.user})
    }
    else{
        res.render("resetOtp",{message:"wrong otp"})
    }
}
const viewResetPassword = function(req,res,next){
    res.render("resetPassword")
}

const putResetPassword = async function(req,res,next){
    console.log("password changing api");
    try{
        let newPass = await hashedPass(req.body.password)
        console.log(req.body.password);
    await user.updateOne({email:req.session.email},{$set:{password:newPass}})
    
    res.render("user/login",{message:"password changed",currentUser:0})

    }
    catch(err){
        console.log(err);
    }
}


module.exports = {
    registerUser,
    viewRegister,
    viewOtp,
    postOtp,
    viewLogin,
    postLogin,
    userHome,
    postReview,
    successGoogleLogin,
    failureGoogleLogin,
    viewEmail,
    viewResetOtp,
    viewResetPassword,
    postmail,
    postResetOtp,
    putResetPassword,
    resendOtp,
    resendEmailOtp,

};
