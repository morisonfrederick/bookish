const express = require("express");
const user = require("../../models/userModel");
const book = require("../../models/bookModel");
const Category = require("../../models/categoryModel");
// const { options } = require("../../routes/userRoute");


// user products viewing page
const productView = async (req, res, next) => {
    try {
        let id = req.session.userid;
        let currentUser = await user.findOne({ _id: id }) || null;
        let page = parseInt(req.query.page) || 1;
        let pageSize = 6;
        let skip = (page - 1) * pageSize;

        // Handle different sort parameter formats
        let sortDirection = req.query.sort;
        if (sortDirection === "ascending" || sortDirection === "1") {
            sortDirection = 1;
        } else if (sortDirection === "descending" || sortDirection === "-1") {
            sortDirection = -1;
        } else {
            sortDirection = -1; // Default sort direction
        }

        let search = req.query.key || "";
        let category = req.query.category || "";

        // Construct the query object
        let query = {};
        if (search) {
            query.$text = { $search: search };
        }
        if (category) {
            query.category = category;
        }

        // Get the total number of books matching the query
        let totalBooks = await book.countDocuments(query);
        let totalPage = Math.ceil(totalBooks / pageSize);

        // Get the books with pagination and sorting
        let books = await book.find(query).skip(skip).limit(pageSize).sort({ price: sortDirection });

        let categories = await Category.find();

        // Render the page with books, categories, pagination, and current user
        res.render("user/shop", {
            products: books,
            categories,
            curentPage: page,
            totalPage,
            currentUser,
            sort: sortDirection,
            message: books.length === 0 ? "No related book found" : null
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};





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
