const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    categoryName : {
        type : String,
        require:true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
})
const category =  mongoose.model("category",categorySchema)
module.exports = category;