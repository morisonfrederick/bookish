const express = require("express")
const category = require("../../models/categoryModel")
const users = require("../../models/userModel")
const books = require("../../models/bookModel")
const admindata = require("../../models/adminModel")
const Order = require("../../models/orderModel")






// admin login page
const isadmin = (req,res,next)=>{
    if(req.session.isadmin){
        next();    
    }
    else{
        res.render("admin/login",{layout:"admin/adminLayout"})
    }
}

const getAdmin = function(req,res,next){

    res.render("admin/login",{layout:"admin/adminLayout",
    adminLoginErr: req.session.adminLoginErr,
      },
      (err, html) => {
        if (!err) {
          // Set adminloginErr to false after rendering
          req.session.adminLoginErr = false;

          res.send(html); // Send the rendered HTML to the client
        } else {
          console.log(err.message);
        }
      })
}

const loginAdmin =async function(req,res,next){
    let data =await admindata.find()
    console.log(data[0].email);
    console.log(req.body.email);
    if(req.body.email==data[0].email&&req.body.password==data[0].password){
        console.log(req.body.email);
        console.log(req.body.password);
        req.session.isadmin = true;
        req.session.adminloggedIn = true;
        req.session.save()
        console.log(req.session.isadmin);
        let userOrders = await Order.find().populate("user_id");
        res.render("admin/dashbord",{layout:"admin/adminLayout",userOrders})
    }
    else{
        req.session.adminLoginErr = 1;
        res.render("admin/login",{adminLoginErr:1,layout:"admin/adminLayout"})
    }
}
    
    

//admin home page

const getAdminHome =async function(req,res,next){
    let userOrders = await Order.find().populate("user_id");
    res.render("admin/dashbord",{layout:"admin/adminLayout",userOrders})
}
// user management page

const  getusers =async function(req,res,next){
    let page = parseInt(req.query.page) || 1
    let pageSize = 6
    let skip = (page-1)*pageSize
    let data = await users.find().skip(skip).limit(pageSize)
    let totalCount = await users.countDocuments()
    let totalPages = Math.ceil(totalCount/pageSize)
    res.render("users",{data,layout:"admin/adminLayout",page:page,totalPages})
}

const blockUser = async function(req,res,next){
    let id = req.params.id
    console.log(id);
    try{
        await users.updateOne({_id:id},{$set:{status:false}})
    res.json({message:"blocked"})
    }
    catch(err){
        console.log(err);
    }
    
}
const unBlockUser = async function(req,res,next){
    let id = req.params.id
    console.log(id);
    try{
        await users.updateOne({_id:id},{$set:{status:true}})
    res.json({message:"blocked"})
    }
    catch(err){
        console.log(err);
    }
    
}
const searchUser = async function(req,res,next){
    let key = req.body.key
    let use = await users.find({firstname:key})
    console.log(use);
    console.log("searching");
    try{
        res.render("users",{data:use,layout:"admin/adminLayout"})
    }
    catch(err){
        console.log(err);
    }
    
}

const getSignOut = function(req,res,next){
    req.session.destroy();
    res.redirect("/admin/login")
}





module.exports = {
    getAdmin,
    loginAdmin,
    getusers,
    getAdminHome,
    blockUser,
    unBlockUser,
    isadmin,
    searchUser,
    getSignOut
}

