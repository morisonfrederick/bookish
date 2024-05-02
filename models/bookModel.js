const mongoose = require("mongoose");
const { array } = require("../middlewares/multer");

const bookSchema = mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    author :{
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    stock: {
        type:Number,
        required:true
    },
    discount:{
        type:String,
        required:true
    },
    imageUrl:{
        type: Array,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    reviews:{
        type:Array
    },
    rating:{
        type: Number,
    }


})
// Assuming you have already connected to your MongoDB database

// Create a text index on the specified fields
bookSchema.index({ name: 'text', author: 'text', category: 'text' });

// Save the schema changes
const book = mongoose.model("book", bookSchema);


module.exports = book;