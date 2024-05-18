const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
    offerCode : {
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
    category:{
        type: String,
        require: true
    },
    book:{
        type: String,
        require: true
    },
    description:{
        type:String,
        require:true
    }
});

const Offer = mongoose.model("Offer", couponSchema);
module.exports = Offer;
