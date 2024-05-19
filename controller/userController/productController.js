const express = require("express");
const user = require("../../models/userModel");
const book = require("../../models/bookModel");
const category = require("../../models/categoryModel");
// const { options } = require("../../routes/userRoute");


// user products viewing page
const productView = async (req, res, next) => {
    let id = req.session.userid
    let currentUser = await user.findOne({_id:id})||null
    let page = parseInt(req.query.page) || 1;
    let pageSize = 6;
    let skip = (page - 1) * pageSize;
    let sortDirection = req.query.sort == "ascending"?1:-1;
    console.log("sort :",sortDirection);
    let totalBooks = await book.countDocuments()||5
    let totalPage = totalBooks<1 ? 1:totalBooks%2 +1
    let search = req.query.key || "";
    console.log(totalPage);
    console.log("search",search);
    console.log(req.query.category);
    let query = {}

        // Modify your query to use $text operator
    if (search !== "") {
        query.$text = { $search: search };
    }
    if(req.query.category){
        query.category = req.query.category
    }
    // if (req.query.minPrice && req.query.maxPrice) {
    //     const minPrice = parseInt(req.query.minPrice);
    //     const maxPrice = parseInt(req.query.maxPrice);
    //     query.price = { $gte: minPrice, $lte: maxPrice };
    //   }
    

    console.log(query);

let books = await book.find(query).skip(skip).limit(pageSize).sort({price:sortDirection});
    if(books.length>0){
        // console.log(books);
        console.log("yes");
        let categories = await category.find();
        res.render("user/shop", { products: books,categories, curentPage: page, totalPage ,currentUser});
    }
    else{
        console.log("no");

        let categories = await category.find();
        res.render("user/shop", { products: books,categories, curentPage: page, totalPage,message:"No related book found" ,currentUser});
    }
   
}



// user prodect detail view 
const bookView = async (req,res,next)=>{
    let userId = req.session.userid || null
    let currentUser = await user.findOne({_id:userId})
    let id = req.params.id
    let books = await book.findOne({_id:id});
    let msg =""
    if(books.stock==0){
        msg= "out of stock"
    }
    else{
        msg= "available"
    }
    
    // console.log(books);
    res.render("user/product",{product:books,message:msg,currentUser})

}

// search books 

const searchProducts = async function(req, res) {
    console.log("searching Products");
    try {
        let q = req.query.key;
        console.log(q);
        if (q) {
            q = q.toLowerCase();
            const searchResults = await book.find({
                name: { $regex: new RegExp(q), $options: 'i' }
            }).lean()
            
            if (searchResults.length > 0) {
                res.send(searchResults);
            } else {
                res.send("No books found matching the query");
            }
        } else {
            res.send("query is empty");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
}







module.exports = {
    productView,
    bookView,
    searchProducts

};
