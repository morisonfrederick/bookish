const Coupon = require("../../models/coupenModel")

const couponLoad = async function(req,res){
    let Coupons = await Coupon.find()
    // console.log(Coupons);
    res.render("admin/coupon",{Coupons,couponAdded:0,success:req.flash("success")})
}
const couponAddLoad = async function(req,res){
    res.render("admin/addcoupon",{codeErr:0})
}
const addCoupon = async function(req,res){
    try{
        console.log("add coupon");
        let {code,discount,start,end,minimum,totalUsers,description} = req.body
        const checking = await Coupon.findOne({couponCode:code})
        if(checking){
            res.render("admin/addcoupon",{codeErr:1})
        }
        else{
            let data ={
                couponCode:code,
                discount:discount,
                startDate: start,
                endDate:end,
                minimumSpend:minimum,
                maxUsers:totalUsers,
                description:description
            }
        
            let updatedCoupon = new Coupon({
                couponCode:code,
                discount:discount,
                startDate: start,
                endDate:end,
                minimumSpend:minimum,
                maxUsers:totalUsers,
                description:description
            })
            await updatedCoupon.save()
            console.log(updatedCoupon)
            req.flash("success","Coupon added successfully")
            res.redirect("/admin/coupon")
        }
    }
    catch(err){
        console.log(err);
    }


    
}


const validateCoupon =async function(data){
    const checking = await Coupon.findOne({couponCode:data.couponCode})
    if(checking){
        let response = "error1"
        return response
    }
}

const deleteCoupon = async function(req,res){
    try{
        let {id} = req.query
        console.log(id);
        await Coupon.deleteOne({_id:id})
        let message = "coupon deleted"
        req.flash("success","coupon deleted")
        res.redirect("/admin/coupon")
    }
    catch(err){
        console.log(err);
    }
}
const editCouponLoad = async function(req,res){
    try{
        let {id} = req.query
        console.log(id);
        let coupon =await Coupon.findOne({_id:id})|| ""
        // console.log();

        res.render("editcoupon",{coupon})
    }
    catch(err){
        console.log(err);
    }
}

const editCoupon = async function(req,res){
    try{
        let id = req.params.id
        console.log(id);
        let {code,discount,start,end,minimum,totalUsers,description} = req.body

        const checking = await Coupon.findOne({couponCode:code})
        if(checking){
            req.flash("success","Coupon with same name exist")
            res.redirect("/admin/coupon")
        }
        else{
            let data = {
                couponCode:code,
                discount:discount,
                startDate: start,
                endDate:end,
                minimumSpend:minimum,
                maxUsers:totalUsers,
                description:description
            }
            await Coupon.updateOne({_id:id},{$set:data})
            req.flash("success","Coupon edited successfully")
            res.redirect("/admin/coupon")
        }

        
    }
    catch(err){
        console.log(err);
    }
}


module.exports = {
    couponLoad,
    couponAddLoad,
    addCoupon,
    deleteCoupon,
    editCoupon,
    editCouponLoad
}