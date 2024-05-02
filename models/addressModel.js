const mongoose = require("mongoose")
const { array } = require("../middlewares/multer")

const addressSchema = mongoose.Schema({
    user_id : {
        type : String,
        required: true
    },
    address1 :{
        type : String,
        required : true
    },
    address2 :{
        type : String,
        required : true
    },
    address3 :{
        type : String,
        required : true
    },
    country :{
        type : String,
        required : true
    },
    city :{
        type : String,
        required : true
    },
    county :{
        type : String,
        required : true
    },
    pin :{
        type : String,
        required : true
    },
    default_address :{
        type : Boolean,
        default:false
    }
})


module.exports =  mongoose.model("Address",addressSchema)