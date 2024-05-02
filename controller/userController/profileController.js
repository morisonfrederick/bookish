const user = require("../../models/userModel")
const address = require("../../models/addressModel")
const bcrypt = require("bcrypt");
const { updateOne } = require("../../models/cartModel");


async function hashedPass(password) {
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}
const viewProfile =async function(req,res){
    // console.log("hi");
    try{
        let id =await req.session.userid
        // console.log(id);
        let updatePassErr =1
            let updatePass = 1
            let profilUpdate = 0

        let userNow =await user.findOne({_id:id})
        let userAddress = await address.findOne({user_id:id,default_address:true})
        // console.log(userNow);
        if(userNow!= undefined||userNow!=null){
            res.render("user/userProfile",{currentUser:userNow,userAddress})
        }
        else{
            
            let currentUser = null
            res.render("user/userProfile",{user:{},currentUser})

        }
    }
    catch(err){
        console.log(err);
    }
    
}
// use order controller 

const viewOrders = async function(req,res){
    res.render("orders")
}

// user address controller 
const viewAddress = async function(req,res){
    try{
        let id = req.session.userid;
        console.log(id);
        let currentUser = await user.findOne({_id:id})
        let userAddress = await address.find({user_id:id});
        console.log(userAddress);
        if(userAddress){
            // console.  log("yes");
            res.render("user/address",{address: userAddress,currentUser});
        } else {
            console.log("no");
            res.render("user/address", {data: {},currentUser});
        }
    } catch(err){
        console.log(err);
    }
}

             
const postAddress = async function(req,res){
    let defaultAddress = req.body.defaultAddress||0
    console.log("final",defaultAddress);
    console.log("body",req.body.defaultAddress);
    let id = await req.session.userid        

    if(defaultAddress==1){
        let addressList = await address.find({user_id:id})
        addressList.forEach(singleAddress => {
            singleAddress.updateOne({$set:{default_address:"false"}})
        });
    }
    try{
        let addressData = {
            user_id : id,
            address1 : req.body.address1,
            address2 : req.body.address2,
            address3 : req.body.address3,
            country : req.body.country,
            city : req.body.city,
            county : req.body.county,
            pin : req.body.pin,
            default_address:defaultAddress,
        }
        
        await address.insertMany([addressData])
        let currentUser = await user.findOne({_id:id})
        let userAddress = await address.find({user_id:id});
            
        // console.log(addressDetails);
        res.render("user/address",{address:userAddress,currentUser})     
        
    }
    catch(err){
        console.log(err);
    }
}

const viewEditAddress =async function(req,res){
    let id = await req.params.id
    let selectedAddress = await address.findOne({_id:id})
    console.log(selectedAddress);
    res.render("editAddress",{data:selectedAddress})

}

const editAddress = async function(req,res){
    let data = await req.body
    let id = await req.params.id
    await address.updateOne({_id:id},{$set:data})
    res.redirect("/home/account")

}


const deleteAddress =async function(req,res){
    console.log("delete address");
    let addressId =await req.params.id;
    await address.deleteOne({_id:addressId})
    res.json({message:"address deleted"})

}

const defaultAddressSetting = async function (req, res) {
    console.log("setting");
    try {
        let user_id = req.session.userid;
        let id = req.params.id

        
        // Set all addresses for the user as non-default
        await address.updateMany({ user_id: user_id }, { $set: { default_address: false } });

        // Set the selected address as default
        await address.updateOne({ _id: id }, { $set: { default_address: true } });

        // Fetch the updated list (optional, depending on your needs)
        let updatedList = await address.findOne({ _id: id });

        console.log(updatedList);
        res.redirect("/home/account");
    } catch (error) {
        console.error("Error setting default address:", error);
        res.status(500).send("Error setting default address");
    }
};




const getSignOut = function(req,res,next){
    req.session.destroy();
    res.redirect("/home/login")
}

// userName controller 

const viewUsername = async function(req,res){
    try{
        let id = await req.session.userid
        // console.log(id);
    let userdetails = await user.findOne({_id:id}).lean()
    // console.log(userdetails);
    
    res.render("accountUsername",{data:userdetails})
    }
    catch(err){
        console.log(err);
    }
    
}

const putUsername = async function(req,res){
    try{
        let userPassword = await req.body.password
        let newUsername = await req.body.username
        // console.log(newUsername);
        let id = await req.session.userid
        let currentUser = await user.findOne({_id:id})
        let checking = await bcrypt.compare(userPassword,currentUser.password)
        if(checking){
            console.log("done");
            await user.updateOne({_id:id},{$set:{firstname:newUsername}})
            let changedUser = await user.findOne({_id:id}).lean()
            // console.log(changedUser);
            res.render("accountUsername",{data:changedUser})
        }
        else 
        res.render("accountUsername",{data:currentUser,message: "wrong password"})
    }
    catch(err){
        console.log(err);
    }
    
}

// user password controller 
const viewChangePassword = async function(req,res,next){
    let currentUser = await user.findOne({_id:req.session.userid})
    console.log(currentUser.firstname);
    try{
    res.render("accountPassword",{currentUser})

    }
    catch(err){
        console.log(err);
    }
}

const putResetPassword = async function(req,res,next){
    try{
        let password =await req.body.password
        let id = await req.session.userid;
        let currentUser = await user.findOne({_id:id})
        console.log(id,currentUser.password,password);
        let checking = await bcrypt.compare(password,currentUser.password)
        console.log(checking);
        

        if(checking){
            let newPass = await hashedPass(req.body.passwordNew)
            await user.updateOne({_id:id},{$set:{password:newPass}})
            res.render("accountPassword",{message:"password changed",currentUser})
        }
        else{
            res.render("accountPassword",{message:"password wrong",currentUser})
        }

        

    }
    catch(err){
        console.log(err);
    }
}


const viewImage = function(req,res){
    res.render("imageCropper")
}







module.exports = {
    viewProfile,
    viewOrders,
    viewAddress,
    postAddress,
    getSignOut,
    viewUsername,
    putUsername,
    viewChangePassword,
    putResetPassword,
    viewEditAddress,
    editAddress,
    deleteAddress,
    viewImage,
    defaultAddressSetting,
    
}