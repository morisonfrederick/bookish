const Order = require("../../models/orderModel")
const book = require("../../models/bookModel")
const user = require("../../models/userModel")
const { v4: uuidv4 } = require('uuid');


const orderView = async function(req, res) {
    // Get the status from the query parameters, if it exists
    let status = req.query.status;
  
    // If a status was provided, find orders with that status
    if (status) {
      let userOrders = await Order.find({ orderStatus: status }).populate("products.product").sort({createdAt:-1})
      res.render("admin/orders", { data: userOrders ,layout:"admin/adminLayout"});
    } else {
      // If no status was provided, find all orders
      let userOrders = await Order.find().populate("user_id").sort({createdAt:-1})
      res.render("admin/orders", { data:userOrders ,layout:"admin/adminLayout"});
    }
  }
  

const changeOrderStatus =async function(req,res){
    let orderId =await req.params.id
    let newStatus =await req.body.status

    await Order.updateOne({_id:orderId},{$set:{orderStatus:newStatus}})

    let changedStatus = await Order.findOne({_id:orderId})
    console.log(changedStatus);
}

const orderDetailsView = async function(req,res){
  console.log("order detail view");
    try{
        let id = req.params.id
        console.log(id);
        let userOrder = await Order.findOne({_id:id}).populate("products.product")
        
        res.render("admin/orderManagment",{data: userOrder,total:150,layout:"admin/adminLayout"})
    }
    catch(err){
        console.log(err);
    }
    
}
const filterOrders = async function(req,res){
    console.log("==========================================");
    let {option} = req.body
    console.log(option);
    let sortedList = await Order.find({orderStatus:option})
    console.log(sortedList);
    if(sortedList){
        res.send(sortedList)
    }
    else{
        res.json({"message":"no order found"})
    }
}


const changeIndividualOrderStatus = async function (req, res) {
  console.log("change status");
    try {
      let orderId = req.params.id; 
      let newStatus = req.body.status; 
      let productsId = req.body.productsId;
  
      console.log(1, orderId);
      console.log(2, newStatus);
      console.log(3, productsId);
  
      await Order.updateOne(
        { _id: orderId, "products._id": productsId },
        { $set: { "products.$.individulOrderStatus": newStatus } }
      );
  
      let changedStatus = await Order.findOne({ _id: orderId }, { products: 1 });
      console.log(changedStatus);
  
      // Send a response back to the client if needed
      res.status(200).json({ message: 'Status updated successfully', data: changedStatus });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Error updating status' });
    }
  };
  



module.exports = {
    orderView,
    changeOrderStatus,
    orderDetailsView,
    changeIndividualOrderStatus,
    filterOrders
}