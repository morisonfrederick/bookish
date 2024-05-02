const Wishlist = require("../../models/wishlistModel")
const User = require("../../models/userModel")
const Book = require("../../models/bookModel")
const user = require("../../models/userModel")



const wishlistLoad = async function(req,res){
    let id = req.session.userid
    let item = await Wishlist.findOne({user:id}).populate("booklist") || 0
    console.log(item);
    let currentUser = User.find({_id:id}) || 0
    res.render("user/wishlist",{currentUser,item})
}

const addWishlist = async function(req, res) {
    console.log("wish list add function");
    let id = req.session.userid;
    const { productId } = req.body;
    console.log("selected book id", productId);

    try {
        let selectedBook = await Book.findOne({ _id: productId }); // Assuming productId is for Book

        if (!selectedBook) {
            return res.status(404).json({ error: "Book not found" });
        }

        let userWishlist = await Wishlist.findOne({ user: id });

        if (!userWishlist) {
            let newUserWishlist = new Wishlist({
                user: id,
                booklist: [productId]
            });
            await newUserWishlist.save();
            console.log(newUserWishlist);
            return res.json({ status: 1 });
        } else {
            if (userWishlist.booklist.includes(productId)) {
                return res.json({ status: 0 });
            } else {
                userWishlist.booklist.push(productId);
                await userWishlist.save();
                return res.json({ status: 1 });
            }
        }
    } catch (err) {
        console.error("Error in addWishlist:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const removeWishlist = async function(req,res){
    console.log("remove wishlist");
    let id = req.session.userid
    let{productId}= req.body
    let userWishlist = await Wishlist.findOne({user:id})
    userWishlist.booklist = userWishlist.booklist.filter(booklist=>booklist.toString()!=productId)
    await userWishlist.save()
    res.json({status: "remove"})
    
}

module.exports = {
    wishlistLoad,
    addWishlist,
    removeWishlist,
}