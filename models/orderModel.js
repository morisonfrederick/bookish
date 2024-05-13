const mongoose = require("mongoose")
const User = require("../models/userModel")
const Books = require("../models/bookModel")
const { v4: uuidv4 } = require('uuid');

const orderSchema = mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required:true
    },
    contact : {
        email:{
            type : String,
            required : true
        },
        phone:{
            type : String,
            required : true
        }
    },
    address : {
        address1: {
            type : String,
            required : true
        },
        address2: {
            type : String,
            required : true
        },
        address3: {
            type : String,
            required : true
        },
        country: {
            type : String,
            required : true
        },
        city: {
            type : String,
            required : true
        },
        county: {
            type : String,
            required : true
        },
        pin: {
            type : Number,
            required : true
        },       
    },
    paymentType: {
        type : String,
        required : true
    },
    products : [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "book",
                required : true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            name: {
                type: String,
                require: true,
            },
            price: {
                type: Number,
                default: 1,
            },
            individulOrderStatus: {
                type : String,
                default: "Placed"
            }
        }
    ],
    orderStatus :{
        type : String,
        default: "Placed"
    },
    totalPrice :{
        type : Number,
        required: true
    },
    orderNumber: {
         type: String, 
         default: uuidv4 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    coupon : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupen",
        default: null
    }
})
const Order =  mongoose.model("Order",orderSchema)
module.exports = Order;