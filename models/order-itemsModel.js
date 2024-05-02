const mongoose = require("mongoose");
const User = require("../models/userModel")
const book = require("../models/bookModel")



const orderItemsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Use 
    ref: "User", 
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});


module.exports =  mongoose.model("orderItems",orderItemsSchema)