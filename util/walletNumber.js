let Wallet = require("../models/walletModel")




const numberExist =async function(num){
    const count = await Wallet.countDocuments({ walletNumber: num });
    return count > 0;
    // console.log("walletIdArray",numArr);
}

const randomNumber = function(){
    let num = Math.floor(Math.random()*900000000000)
    return num
}

const walletNumber =async function(){
    let num
    do{
      num =   randomNumber()
    }
    while(await numberExist(num))
    return num
}

module.exports = walletNumber