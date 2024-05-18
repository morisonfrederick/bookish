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
    console.log("add coupon");
    let {code,discount,start,end,minimum,totalUsers,description} = req.body
     // Validation
    //  if (!code || !discount || !start || !end || !minimum || !totalUsers) {
    //     return res.status(400).send("Missing required fields");
    console.log(1,"code",code,);
    console.log(2,"discount",discount);
    console.log(3,"start",start);
    console.log(4,"end",end);
    console.log(5,"minimum",minimum);
    console.log(6,"totalUsers",totalUsers);
    console.log(7,"description",description);


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
    res.redirect("/admin/coupon")
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