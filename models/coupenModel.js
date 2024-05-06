const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
    couponCode : {
        type: String,
        require: true
    },
    discount: {
        type:Number,
        require:true
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
        require: true
    },
    minimumSpend:{
        type: Number,
        require: true
    },
    maxUsers:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require:true
    }
});

const Coupon = mongoose.model("Coupen", couponSchema);
module.exports = Coupon;
