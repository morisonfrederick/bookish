const cart = require("../../models/cartModel")
const book = require("../../models/bookModel");
const user = require("../../models/userModel");




const viewCart = async function(req, res) {
    try{
        let id = await req.session.userid;
        let currentUser = await user.findOne({_id:id})||null
        // Find the user's cart and populate the product field
        let userCart = await cart.findOne({ user_id: id }).populate('products.product');
        if(userCart){
            // console.log(userCart.products);
            // Calculate the total price
            let totalPrice = 0;
            userCart.products.forEach(item => {
                totalPrice += item.product.price * item.quantity;
            });

            // Send the cart data including the price, quantity and total price
            res.render('user/cart', {
                cart: userCart,
                total: totalPrice,
                currentUser
            });
        }
        else{
            res.render('user/cart', {
                cart: null,
                totalPrice: null,
                currentUser,
                total:null,
                products:null
            });
        }

    }
    catch(err){
        console.log(err);
    }

    
    
}


const postCart = async function(req, res) {
    try {
        const id = req.session.userid;
        const selectedBookId = req.body.bookId;
        const currentBook = await book.findOne({_id: selectedBookId});
        let name = currentBook.name
        let price = currentBook.price
        const quantity = req.body.quantity;
        let selectedQuantity = 1;
        if(quantity){
            selectedQuantity = quantity;
        }
        let userCart = await cart.findOne({user_id: id});
        if(!userCart){
            let data = {
                user_id: id,
                products: [{
                    product: selectedBookId,
                    quantity: selectedQuantity,
                    name: name,
                    price: price
                }],
            };
            let newStock = currentBook.stock - selectedQuantity;
            currentBook.stock = newStock;
            await currentBook.save();
            let updatedCart = await cart.insertMany([data]);
            res.send(updatedCart);
        } else {
            let productInCart = userCart.products.find(product => product.product == selectedBookId);
            if (productInCart) {
                productInCart.quantity += selectedQuantity;
            } else {
                userCart.products.push({
                    product: selectedBookId,
                    quantity: selectedQuantity,
                    name: name,
                    price: price
                });
            }
            let updatedCart = await userCart.save();
            res.send(updatedCart);
        }
    } catch(err) {
        console.log(err);
        res.status(500).send({message: 'An error occurred while adding to cart'});
    }
}


const deleteCart =async function(req,res){

    try {
        const userId = req.session.userid;
        const bookId = req.body.bookId;
        console.log(bookId);

        // Find the user's cart
        let userCart = await cart.findOne({ user_id: userId });

        // Remove the product from the cart
        userCart.products = userCart.products.filter(product => product.product.toString() !== bookId);

        // Save the updated cart
        let updatedCart = await userCart.save();

        res.json(updatedCart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


const changeQuantity = async function(req, res) {
    try{
        let id = req.session.userid;
        let selectedBook = req.params.id;
        let qty = parseInt(req.body.quantity); // Convert the quantity to a number
        let userCart = await cart.findOne({user_id: id});
        let productInCart = userCart.products.find(product => product.product == selectedBook);
    
        // Fetch the inventory for the selected book
        let inventoryItem = await book.findOne({_id: selectedBook});
    
        if (qty == -1 && productInCart.quantity != 1){
            productInCart.quantity += qty;
            inventoryItem.stock-=qty
            await inventoryItem.save()
    
        }
        else if (qty == 1 && productInCart.quantity < 10 &&inventoryItem.stock>1) {
            productInCart.quantity += qty;
            inventoryItem.stock-=qty
            await inventoryItem.save()
        }
    
        let updatedCart = await userCart.save();
    
        res.send(updatedCart);
    }
    catch(err){
        console.log(err);
    }

}



module.exports = {
    viewCart,
    postCart,
    deleteCart,
    changeQuantity,
}