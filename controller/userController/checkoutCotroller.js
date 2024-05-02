const user = require("../../models/userModel")
const book = require("../../models/bookModel")
const cart = require("../../models/cartModel")
const address = require("../../models/addressModel")
const Order = require("../../models/orderModel")

const viewCheckout = async function(req,res){

    try{
        let id = req.session.userid
        let userAddress = await address.find({user_id:id})
        let currentUser = await user.findOne({_id:id})
        // Find the user's cart and populate the product field
        let userCart = await cart.findOne({ user_id: id }).populate('products.product');
        if(userCart){
            // Calculate the total price
            let totalPrice = 0;
            userCart.products.forEach(item => {
                totalPrice += item.product.price * item.quantity;
            });
            res.render("checkout",{address:userAddress,currentUser,cart: userCart,total:totalPrice})
        }
        else{
            res.render("checkout",{address:userAddress,currentUser,cart: null,total:null})
        }
    }
    catch(err){
        console.log(err);
    }

    const postAddress = async function(req,res){
        
    }
    
    // console.log(userCart.products);
    
}






module.exports = {
    viewCheckout,
}