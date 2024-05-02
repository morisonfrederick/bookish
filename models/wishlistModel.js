const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  booklist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "book"
  }]
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
