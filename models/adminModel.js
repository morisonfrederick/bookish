const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
})


const admindata = mongoose.model("admindata",adminSchema)

module.exports = admindata;