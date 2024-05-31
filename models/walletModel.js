const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    walletNumber : {
        type: Number,
        require: true
    },
    balance: {
        type:Number,
        default:0
    },
    history: [
        {
            amount: {
                type: Number,
                require: true
            },
            method: {
                type: String,
                require: true
            },
            paymentType: {
                type: String,
                require: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
   
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
