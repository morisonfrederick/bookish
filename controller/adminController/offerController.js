const Categories = require("../../models/categoryModel")
const Books = require("../../models/bookModel")
const Offer = require("../../models/offerModel")



const addOfferLoad = async function(req,res){
    let categories = await Categories.find()
    let books = await Books.find()
    res.render("addOffer",{codeErr:0,categories,books})
}

const addOffer = async function(req,res){
    console.log("ADD OFFER");
    let {code,discount,start,end,category,book,description} = req.body;
    let selectedCategory = category?category:"No category selected"
    let selectedBook = book?book:"No book selected"
    let data ={
        offerCode: code,
        discount: discount,
        startDate: start,
        endDate: end,
        category: selectedCategory,
        book: selectedBook,
        description: description
    }
    let newOffer =await new Offer(data)
    await newOffer.save()

    // apply discount on selectedBook || selectedCategory
    if(selectedCategory!=="No category selected"){
        console.log("apply discount on selcted category ");
        let books = await Books.find({category:selectedCategory})
        books.forEach(async(book)=>{
            let bookPrice = book.price;
            let discountedPrice = bookPrice-discount
            await Books.updateOne({_id:book._id},{$set:{offerApplied:true, discount:discountedPrice}})
        })
        res.redirect("/admin/offer")
    }
    else if(selectedBook!="No book selected"){
            console.log("apply discount on selectedBook ");
            let book = await Books.findOne({name:selectedBook})
            let bookPrice = book.price;
            let discountedPrice = bookPrice-discount
            await Books.updateOne({name:selectedBook},{$set:{offerApplied:true, discount:discountedPrice}})
            res.redirect("/admin/offer")
            
    }
    

    
}

const offerLoad = async function(req,res){
    let allOffers = await Offer.find();
    console.log("offer loading ==========================================");
    res.render("offer",{offer:allOffers,success:0,couponAdded:0})
}

const editOfferLoad = async function(req,res){
    let books = await Books.find()
    let categories = await Categories.find()
    let id = req.query.id

    let offer =await Offer.findOne({_id:id})
    console.log("offer book",offer.book);
    console.log("offer id: ",id);
    console.log("offer: ",offer);
    res.render("editOffer",{offer,categories,book:books})
}

const editOffer = async function(req,res){
    
    let id = req.params.id
    console.log("ADD OFFER");
    let {code,discount,start,end,category,book} = req.body;
    let selectedCategory = category?category:"No category selected"
    let selectedBook = book?book:"No book selected"
    let data ={
        offerCode: code,
        discount: discount,
        startDate: start,
        endDate: end,
        category: selectedCategory,
        book: selectedBook
    }
    
    await Offer.updateOne({_id:id},{$set:data})
    if(selectedCategory!=="No category selected"){
        console.log("apply discount on selcted category ");
        let books = await Books.find({category:selectedCategory})
        books.forEach(async(book)=>{
            let bookPrice = book.price;
            let discountedPrice = bookPrice-discount
            await Books.updateOne({_id:book._id},{$set:{offerApplied:true, discount:discountedPrice}})
        })
        req.flash("success","Offer edited successfully")
        res.redirect("/admin/offer")
    }
    else if(selectedBook!="No book selected"){
            console.log("apply discount on selectedBook ");
            let book = await Books.findOne({name:selectedBook})
            let bookPrice = book.price;
            let discountedPrice = bookPrice-discount
            await Books.updateOne({name:selectedBook},{$set:{offerApplied:true, discount:discountedPrice}})
            req.flash("success","Offer edited successfully")
            res.redirect("/admin/offer")
            
    }
    
}

const deleteOffer = async function(req,res){
    let {id} = req.query
    let offer = await Offer.findOne({_id:id})
    if(offer.category=="No category selected"){
        await Books.updateOne({name:offer.book},{$set:{discount:0, offerApplied:false}})
        await Offer.deleteOne({_id:id})
        res.redirect("/admin/offer")
    }
    else{
        let books = await Books.find({category: offer.category})
        books.forEach(async(book)=>{
            await Books.updateOne({_id:book._id},{$set:{discount:0, offerApplied:false}})
            
        })
        await Offer.deleteOne({_id:id})
            res.redirect("/admin/offer")
    }
}


module.exports = {
    addOfferLoad,
    addOffer,
    offerLoad,
    editOffer,
    editOfferLoad,
    deleteOffer
}