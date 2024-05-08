const Books = require("../../models/bookModel")
const Order = require("../../models/orderModel")
const cart = require("../../models/cartModel")
let userAddress = require("../../models/addressModel")
const { v4: uuidv4 } = require('uuid');
const user = require("../../models/userModel");
const Coupon = require("../../models/coupenModel")


const viewOrders =async function(req,res){
    let id = await req.session.userid
    // let userOrders = await Order.find({user_id:id})
    // let userOrders = await Order.find({ user_id: id }).populate('products.product');
    let userOrders = await Order.find({ 
        user_id: id, 
        'orderStatus': { $ne: 'Cancel' } 
    }).populate('products.product');

    let currentUser = await user.findOne({_id:id})||null
    
    // console.log(userOrders);
    console.log("total orders ",userOrders.length);
    // console.log(userOrders[0].products);
    

    res.render("allorders",{order: userOrders,currentUser})
}
const postCheckoutOrder = async function(req,res){
    try{
        let id = req.session.userid
        let userCart = await cart.findOne({ user_id: id }).populate('products.product')
        let totalPrice = 0;
        userCart.products.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });
        console.log(totalPrice);
        let {email,phone,address,address1,address2,address3,country,city,county,pin,paymentType,couponCode} = await req.body
        console.log(paymentType);
        let coupon = null

        if(couponCode){
            coupon  = await Coupon.findOne({couponCode: couponCode})
            console.log(couponCode);

        }
        let discountedPrice = totalPrice
        if(coupon && totalPrice > coupon.minimumSpend){
            discountedPrice -= coupon.discount
        }
        console.log(1,discountedPrice)
        console.log(2,totalPrice);

        if(address=="newAddress"){
            console.log("new address");
            let data = {
                user_id : id,
                contact : {
                    email:email,
                    phone:phone
                },
                address : {
                    address1:address1 ,
                    address2:address2,
                    address3:address3,
                    country:country,
                    city:city,
                    county:county,
                    pin:pin,
                    
                },
                paymentType: paymentType,
                products: userCart.products.map(product => ({
                    product: product.product._id,
                    quantity: product.quantity,
                })),
                orderStatus : "Placed",
                totalPrice : discountedPrice,
                orderNumber: uuidv4()
                    
            }
            console.log(data);
    
            if(paymentType=="cod"){
                console.log("going to save");
                const order = new Order(data);
                await order.save();
                await cart.deleteOne({user_id:id})

                console.log(order);
            }
    
            console.log(Order.length);
            
            // res.render("orders",{order: data})
            res.redirect("/home/account/orders")
        }
        else{
            console.log("default address");
            let currentUser = await user.findOne({_id:id})
            console.log(address);
            let selectedAddress = await userAddress.findOne({_id:address})
            let data = {
                user_id : id,
                contact : {
                    email:currentUser.email,
                    phone:currentUser.phone
                },
                address : selectedAddress
                ,
                paymentType: paymentType,
                products: userCart.products.map(product => ({
                    product: product.product._id,
                    quantity: product.quantity,
                })),
                orderStatus : "Placed",
                totalPrice : discountedPrice
                    
            }  
            console.log(data);
    
            if(paymentType=="cod"){
                console.log("going to save");
                const order = new Order(data);
                await order.save();
                await cart.deleteOne({user_id:id})
                let success = 1
                // console.log(order);
                console.log(Order.length);
                let orderData = await order.populate("products.product")
                // console.log(orderData);
                res.render("user/orderStatus",{selcetedOrder:orderData,currentUser,success})
            }
    
            
        }     
        }
        
    catch(err){
        console.log(err)
    }
}

const cancelOrder = async function(req,res){
    let orderId = req.params.id;
    await Order.updateOne({_id:orderId},{$set:{orderStatus:"Cancel"}})
    res.json({message:"succsess"})
    
}

const viewOrdersDetails =async function(req,res){
    let id = await req.params.id
    let currentUser = req.session.userid
    let userOrders = await Order.findOne({_id: id }).populate('products.product');
    
    // console.log(userOrders);
    console.log("total orders ",userOrders.length);

    res.render("userOrderDetails",{order: userOrders,currentUser})
}

const cancelIndividualOrder = async function(req, res) {
    try {
        let orderId = req.params.id;
        let newStatus = "Cancel";
        let productsId = req.body.productsId;

        // Get the cancelled product details
        let cancelledProduct = await Order.findOne(
            { _id: orderId, 'products._id': productsId },
            { 'products.$': 1 }
        );

        if (!cancelledProduct) {
            return res.status(404).json({ message: 'Product not found in order' });
        }

        // Calculate the price of the cancelled item
        let cancelledPrice = cancelledProduct.products[0].product.price * cancelledProduct.products[0].quantity;

        // Update the order to cancel the product
        await Order.updateOne(
            { _id: orderId },
            { $pull: { products: { _id: productsId } } }
        );

        // Recalculate the total price after cancellation
        let updatedOrder = await Order.findOne({ _id: orderId }).populate('products.product');
        let totalPrice = 0;
        updatedOrder.products.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        // Update the order's total price
        await Order.updateOne(
            { _id: orderId },
            { totalPrice: totalPrice }
        );

        // Send a response back to the client with updated order details
        res.status(200).json({ message: 'Order item cancelled successfully', totalPrice: totalPrice });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error cancelling order item' });
    }
}



const applyCoupon = async function(req, res) {
    try {
        let action = req.body.action;
        let userCode = req.body.data;
        let id = req.session.userid;
        let userCart = await cart.findOne({ user_id: id }).populate('products.product');

        switch (action) {
            case "apply":
                let coupon = await Coupon.findOne({ couponCode: userCode }).lean();
                let totalPrice = calculateTotalPrice(userCart);
                if (coupon) {
                    let totalPrice = calculateTotalPrice(userCart);
                    let discountedPrice = totalPrice - coupon.discount;
                    let data = {
                        valid: true,
                        totalDisplay: totalPrice,
                        discountDisplay: coupon.discount,
                        discountedPrice: discountedPrice
                    };
                    res.json(data);
                } else {
                    let data = {
                        valid: false,
                        message: "Coupon is not valid"
                    };
                    res.json(data);
                }
                break;
            case "remove":
                if (userCart && userCart.products.length > 0) {
                    let totalPrice = calculateTotalPrice(userCart);
                    let data = {
                        valid: true,
                        totalDisplay: totalPrice,
                        discountDisplay: 0.0,
                        discountedPrice: totalPrice
                    };
                    res.json(data);
                } else {
                    let data = {
                        valid: false,
                        message: "Cart is empty or not found"
                    };
                    res.json(data);
                }
                break;
            default:
                throw new Error("Invalid action provided");
        }
    } catch (err) {
        console.error("Error occurred in applyCoupon:", err.message);
        console.error("Request body:", req.body);
        console.error("Session user ID:", req.session.userid);
        let data = {
            valid: false,
            message: "An error occurred. Please try again later."
        };
        res.status(500).json(data);
    }
};

function calculateTotalPrice(userCart) {
    let totalPrice = 0;
    userCart.products.forEach(item => {
        totalPrice += item.product.price * item.quantity;
    });
    return totalPrice;
}







module.exports = {
    viewOrders,
    postCheckoutOrder,
    cancelOrder,
    viewOrdersDetails,
    cancelIndividualOrder,
    applyCoupon
}