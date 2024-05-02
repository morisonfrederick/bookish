const books = require("../../models/bookModel")
const category = require("../../models/categoryModel")
const upload = require("../../middlewares/multer")
const multer = require("multer")
const sharp = require("sharp")
const { check, validationResult } = require('express-validator');
const book = require("../../models/bookModel")

const viewProducts =async function(req,res,next){ 
    console.log("view products"); 
    let page = parseInt(req.query.page) || 1
    let pageSize = 6
    let skip = (page-1)*pageSize
    let totalCount = await book.countDocuments()
    let totalPages = Math.ceil(totalCount/pageSize)
    let data = await books.find().skip(skip).limit(pageSize)
    let categoryList = await category.find()
    // console.log(data);
    res.render("admin/products",{book:data,categories:categoryList,page:page,totalPages,layout:"admin/adminLayout"})
}



const viewAddProducts = async function(req,res){
    let page = parseInt(req.query.page) || 1
    let pageSize = 6
    let skip = (page-1)*pageSize
    
    let categoryList = await category.find()
    res.render("admin/addProduct",{categories:categoryList,page:page,totalPages:5,layout:"admin/adminLayout"})
}




const addProduct = [
    // Validate & sanitize fields.
    check('name').trim().isLength({ min: 1 }).withMessage('Name is required.'),
    check('author').trim().isLength({ min: 1 }).withMessage('Author is required.'),
    check('price').isNumeric().withMessage('Price must be a number.'),
    check('description').trim().isLength({ min: 1 }).withMessage('Description is required.'),
    check('category').trim().isLength({ min: 1 }).withMessage('Category is required.'),
    check('stock').isNumeric().withMessage('Stock must be a number.'),
    check('discount').isNumeric().withMessage('Discount must be a number.'),

    async (req, res) => {
        console.log("add product");
        let book = await books.find()
        let page = parseInt(req.query.page) || 1
        // Check for validation errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("some error");
            let categoryList = await category.find()
            return res.render('admin/products', { errors: errors.array(), categories: categoryList, layout: "admin/adminLayout", book, page, totalPages: 5 });
        }

        try {

            // if (req.files) {
            //     if (Array.isArray(req.files)) {
            //         images = req.files.map((file) => file.filename);
            //     } else {
            //         images.push(req.files.filename);
            //     }
            // }
            let images = [req.files.image1[0].filename,req.files.image2[0].filename,req.files.image3[0].filename,req.files.image4[0].filename] || "empty"
            console.log(images[0]);

            let croppedImages = await Promise.all(images.map(async (image) => {
                const imagePath = "public/products/images/" + image;
                const outputPath = "public/products/crop/" + image;
                
                await sharp(imagePath)
                    .resize({ width: 141, height: 225, fit: 'cover' })
                    .toFile(outputPath);

                return outputPath;
            }));
            console.log(croppedImages);


            const book = new books({
                name: req.body.name,
                author: req.body.author,
                price: parseInt(req.body.price),
                description: req.body.description,
                category: req.body.category,
                stock: parseInt(req.body.stock),
                discount: parseInt(req.body.discount),
                imageUrl: images
            });

            await book.save();

            res.redirect("/admin/books");
        } catch (err) {
            console.log(err.stack);
            res.status(500).send("Internal Server Error: " + err.message);
        }
    }
];








const editProducts = async function(req,res,next){
    console.log("edit products function");
    try{
        let id = req.params.id;
        console.log("book-id",id);
        let selectedBook = await books.findOne({_id:id})
        // console.log(req.files);
        let image1 =req.files.image1?req.files.image1[0].filename:selectedBook.imageUrl[0]
        let image2 = req.files.image2?req.files.image2[0].filename:selectedBook.imageUrl[1] 
        let image3 = req.files.image3?req.files.image3[0].filenameJ:selectedBook.imageUrl[2] 
        let image4 = req.files.image4?req.files.image4[0].filename:selectedBook.imageUrl[3] 


        console.log(image1);
        let images = [image1,image2,image3,image4]
            console.log("images :",images);

            let croppedImages = await Promise.all(images.map(async (image) => {
                const imagePath = "public/products/images/" + image;
                const outputPath = "public/products/crop/" + image;
                
                await sharp(imagePath)
                    .resize({ width: 141, height: 225, fit: 'cover' })
                    .toFile(outputPath);

                return outputPath;
            }));
        
        console.log(images);
        // let newImg = req.files.length > 0 ? images : selectedBook.imageUrl;

        // console.log(newImg);
            
            let data = { 
                name: req.body.name,
                author: req.body.author,
                price: parseInt(req.body.price),
                description : req.body.description,
                category: req.body.category,
                stock: parseInt(req.body.stock) ,
                discount : parseInt(req.body.discount),
                imageUrl : images,
            }
            console.log(data);
            await books.updateOne({_id:id},{$set:data})
            res.redirect("/admin/books")

    }
    catch(err){
        console.log(err);
    }
}


const viewEditProducts = async function(req,res,next){
    let id = req.params.id;
    let data = await books.findOne({_id:id});
    let categoryList = await category.find()
    res.render("admin/editProduct",{product:data,categories:categoryList,layout:"admin/adminLayout"})
}
const deleteBook =async function(req,res,next){
    let id =await req.params.id
    await books.deleteOne({_id:id})
    console.log("deleted");
    res.json({message:"category deleted"})
}

module.exports = {
    addProduct,
    editProducts,
    viewProducts,
    deleteBook,
    viewEditProducts,
    viewAddProducts,
}