const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    balance: {
        type:Number,
        default:0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
   
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
