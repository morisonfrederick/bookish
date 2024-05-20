let Wallet =  require("../../models/walletModel")
let User = require("../../models/userModel")


const walletLoad = async function(req,res){
    try{
        let id = req.session.userid
        let userData = await User.findOne({_id:id})
        let wallet = await Wallet.findOne({userid:id})
        if(!wallet){
            res.render("wallet",{currentUser:userData,userData,wallet:0,history:0})
        }
        res.render("wallet",{currentUser:userData,userData,wallet,history:0})
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    walletLoad
}