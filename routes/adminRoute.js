
const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController/adminController");
const productController = require("../controller/adminController/productConroller")
const upload = require("../middlewares/multer")
const categoryController = require("../controller/adminController/categoryCotroller")
const auth = require("../middlewares/auth")
const orderController = require("../controller/adminController/orderController")
const couponController = require("../controller/adminController/coupenController")
const salesReportController = require("../controller/adminController/salesReportController")
const offerController = require("../controller/adminController/offerController")


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// admin login page route 
router.get("/login",auth.isnotAdmin, adminController.getAdmin);
router.post("/",adminController.loginAdmin)

// admin log out route 
router.get("/signout",adminController.getSignOut)

// admin dash-board route 
router.get("/",auth.adminLogin,adminController.getAdminHome)

// admin user management route 
router.get("/users",auth.adminLogin,adminController.getusers)
router.post("/users",auth.adminLogin,adminController.searchUser)

// admin category management route 
router.get("/category",auth.adminLogin,categoryController.getCategory)
router.post("/category",auth.adminLogin,categoryController.postCategory)
router.put("/category/edit/:id",auth.adminLogin,categoryController.putCategory)
router.get("/category/delete/:id",auth.adminLogin,categoryController.deleteCategory)
router.get("/category/edit/:id",auth.adminLogin,categoryController.getEditCategory)
router.get("/category/search/",auth.adminLogin,categoryController.searchCategory)
// router.patch("/category/block/",categoryController.toggleListedStatus)



// admin user management route 
router.patch("/users/block/:id",auth.adminLogin,adminController.blockUser)
router.patch("/users/unblock/:id",auth.adminLogin,adminController.unBlockUser)

// admin product management route 
router.get("/books",auth.adminLogin,productController.viewProducts)
router.post("/books",auth.adminLogin,upload,productController.addProduct)
router.delete("/books/delete/:id",auth.adminLogin,productController.deleteBook)
router.get("/books/edit/:id",auth.adminLogin,productController.viewEditProducts)
router.put("/books/edit/:id",auth.adminLogin,upload,productController.editProducts)
router.get("/books/add",auth.adminLogin,productController.viewAddProducts)


// admin order management 

router.get("/orders",auth.adminLogin,orderController.orderView)
router.put("/order/:id",auth.adminLogin,orderController.changeOrderStatus)
router.get("/order/details/:id",auth.adminLogin,orderController.orderDetailsView)
router.put("/order/details/:id",auth.adminLogin,orderController.changeIndividualOrderStatus)
router.post("/order",auth.adminLogin,orderController.filterOrders)

// admin coupon management 
router.get("/coupon",auth.adminLogin,couponController.couponLoad)
router.get("/coupon/add",auth.adminLogin,couponController.couponAddLoad)
router.post("/coupon/add",auth.adminLogin,couponController.addCoupon)
router.get("/coupon/delete",auth.adminLogin,couponController.deleteCoupon)
router.put("/coupon/edit/:id",auth.adminLogin,couponController.editCoupon)
router.get("/coupon/edit",auth.adminLogin,couponController.editCouponLoad)


// admin sales report page 
router.get("/sales",salesReportController.saleReportLoad)
router.get("/sales/excel-report",salesReportController.excelSheet)

// admin offer module 
router.get("/offer/add",auth.adminLogin,offerController.addOfferLoad)
router.get("/offer",auth.adminLogin,offerController.offerLoad);
router.post("/offer/add",auth.adminLogin,offerController.addOffer);
router.put("/offer/edit/:id",auth.adminLogin,offerController.editOffer)
router.get("/offer/edit",auth.adminLogin,offerController.editOfferLoad)
router.get("/offer/delete",auth.adminLogin,offerController.deleteOffer)



module.exports = router;
