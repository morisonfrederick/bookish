const express = require("express")
const router = express.Router()
const userController = require("../controller/userController/userController")
const passport = require("passport");
require("../middlewares/passport")
const profileController = require("../controller/userController/profileController")
const auth = require("../middlewares/auth")
const cartController = require("../controller/userController/cartController")
const checkoutCotroller = require("../controller/userController/checkoutCotroller")
const orderController = require("../controller/userController/orderController")
const productController = require("../controller/userController/productController")
const upload = require("../middlewares/multer");
const wishlistController = require("../controller/userController/wishlistController")
const walletController = require("../controller/userController/walletController")








router.use(passport.initialize());
router.use(passport.session())

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/signup",userController.viewRegister)

router.post("/signup",userController.registerUser)

router.get("/login",userController.viewLogin)
router.post("/login",userController.postLogin)

// Auth 
router.get('/auth/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 

// Auth Callback 
router.get( '/auth/google/cb', 
	passport.authenticate( 'google', { 
		successRedirect: '/home/success', 
		failureRedirect: '/home/failure'
}));

// Success 
router.get('/success' , userController.successGoogleLogin); 

// failure 
router.get('/failure' , userController.failureGoogleLogin);



router.get("/",userController.userHome)

router.get("/books",productController.productView)
router.get("/books/:id",productController.bookView)
router.post("/books",productController.searchProducts)



router.get("/signup/otp/resendOtp",userController.resendOtp)

router.get("/signup/otp",userController.viewOtp)
router.post("/signup/otp",userController.postOtp)

// route to post review 
router.post("/books/review/:id",auth.userLogin,userController.postReview)

// routes to forget password 

router.get("/login/email",userController.viewEmail)
router.post("/login/email",userController.postmail)
router.get("/login/email/otp",userController.viewResetOtp)
router.get("/login/email/otp/resend",userController.resendEmailOtp)
router.post("/login/email/otp",userController.postResetOtp)
router.get("/login/email/otp/reset",userController.viewResetPassword)
router.put("/login/email/otp/reset",userController.putResetPassword)

// route to user profile  address

router.get("/account",auth.userLogin,profileController.viewProfile)
// router.get("/account/orders",auth.userLogin,profileController.viewOrders)
router.get("/account/address",auth.userLogin,profileController.viewAddress)
router.post("/account/address",auth.userLogin,profileController.postAddress)
router.get("/account/address/edit/:id",auth.userLogin,profileController.viewEditAddress)
router.put("/account/address/edit/:id",auth.userLogin,profileController.editAddress)
router.put("/account/address/edit/:id",auth.userLogin,profileController.editAddress)
router.patch("/account/address/edit/:id",auth.userLogin,profileController.defaultAddressSetting)
router.delete("/account/address/delete/:id",auth.userLogin,profileController.deleteAddress)



router.get("/signout",auth.userLogin,profileController.getSignOut)

// route to user profile  username
// router.get("/account/username",auth.userLogin,auth.userLogin,profileController.viewUsername)
// router.put("/account/username",auth.userLogin,profileController.putUsername)

// route to cart 

router.get("/cart",auth.userLogin,cartController.viewCart)
router.post("/cart",auth.userLogin,cartController.postCart)
router.delete("/cart",auth.userLogin,cartController.deleteCart)
router.patch("/cart/:id",auth.userLogin,cartController.changeQuantity)


// route to checkout 

router.get("/cart/checkout",auth.userLogin,checkoutCotroller.viewCheckout)
router.post("/cart/checkout",auth.userLogin,orderController.applyCoupon)




// route to manage orders 

router.get("/account/orders",auth.userLogin,orderController.viewOrders)
router.post("/cart/orders",auth.userLogin,orderController.postCheckoutOrder)
router.patch("/account/orders/:id",auth.userLogin,orderController.cancelOrder)
router.get("/account/orders/details/:id",auth.userLogin,orderController.viewOrdersDetails)
router.patch("/account/orders/details/:id",auth.userLogin,orderController.cancelIndividualOrder)
router.patch("/account/orders/return/:id",auth.userLogin,orderController.returnProduct)




// routes to manage user password from profile 

router.get("/account/password",auth.userLogin,profileController.viewChangePassword)
router.put("/account/password",auth.userLogin,profileController.putResetPassword)


router.get("/image",auth.userLogin,profileController.viewImage)


// routes to manage user wishlist 

router.get("/account/wishlist",auth.userLogin,wishlistController.wishlistLoad)
router.post("/account/wishlist",auth.userLogin,wishlistController.addWishlist)
router.delete("/account/wishlist",auth.userLogin,wishlistController.removeWishlist)

// router.get("/check",wishlistController.checkLoad)


// routes to manage paypal 

router.get("/pay-success",orderController.paymentSuccess)

router.get("/pay-cancel",orderController.failurePayment)


// routes for wallet 
router.get("/account/wallet",auth.userLogin,walletController.walletLoad)

module.exports = router;