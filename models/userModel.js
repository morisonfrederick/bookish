const mongoose = require("mongoose")

const useSchema = mongoose.Schema({
        firstname : {
            type:String ,
            required: true	
        },
        lastname : {
            type:String ,
            required: true	
        }, String,
        email : {
            type:String ,
            required: true	
        },String,
        phone : {
            type:Number ,
            required: true	
        },
        password : {
            type:String ,
            required: true	
        },
        address : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
        ],
        status : {
            type:Boolean ,
            default: true	
        }
      
      
})

const user = mongoose.model("user",useSchema)
module.exports = user;