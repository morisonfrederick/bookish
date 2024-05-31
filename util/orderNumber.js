const Order = require("../models/orderModel")


const numberExist = async function(num){
    let orderNum =  await Order.countDocuments({orderNumber:num})
    return orderNum > 0
}

const randomNum = function(){
    let num = Math.floor(Math.random()*900000000000)
    return num
}

const orderNumber =async function(){
    let num
    do{
       num = randomNum()
    }
    while(await numberExist(num))
    return num
}

module.exports = orderNumber