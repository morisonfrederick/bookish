const express = require("express")

const category = require("../../models/categoryModel")



//category management

const getCategory =async function(req,res,next){
    let categories =await category.find()
    // console.log(categories.length);
    res.render("admin/category",{categories:categories,layout:"admin/adminLayout"})


}
//create new category
const postCategory = async function(req,res,next){

    console.log("posting category");
    try{
        let data =await category.find()
        const newCategory = req.body.name.toLowerCase()
        console.log(newCategory);
        const data2 = {
            categoryName:newCategory
        }
    const checking =await category.findOne({categoryName:newCategory})

    if(checking){
        res.render("category",{message:"category with same name exist",data,layout:"admin/adminLayout"})
    }
    else{
        await category.insertMany([data2])
        let data =await category.find()
        // console.log(data);
        res.render("category",{message:"category added",categories:data,layout:"admin/adminLayout"})
    }
    }
    catch(err){
        console.log(err.message);
    }
}

const putCategory =async function(req,res,next){
    console.log("edit category");
    let id =await  req.params.id
    let name = req.body.name.toLowerCase()
    // console.log(name);
    // console.log(id);
    let data = await category.find()
    const checking =await category.findOne({categoryName:name})
    if(checking){
        res.render("category",{message:"category with same name exist",categories:data,layout:"admin/adminLayout"})
    }
    else{
        await category.updateOne({_id:id},{$set:{categoryName:name}})
    console.log("editCategory");
    let categories    = await category.find()
    res.render("category",{categories:categories,message:"category edited",layout:"admin/adminLayout"})
        }
    
}
 
const getEditCategory = async function(req,res,next){
    try{
        console.log("getEditCategory");
        let id =await req.params.id  
        console.log(id);
        let categories = await category.findOne({_id:id})
        console.log(categories.categoryName);
        res.render("categoryEdit",{categories:categories,layout:"admin/adminLayout"})
    }
    catch(err){
        console.log(err);
    }

}
const deleteCategory =async function(req,res,next){
    try{
        let id =await req.params.id
        await category.deleteOne({_id:id})
        console.log("deleted");
        res.redirect("/admin/category");
    }
    catch(err){
        console.log(err);
    }

}

const searchCategory = async (req, res) => {
    try {
      let categories = await category.find({
        categoryName: { $regex: req.query.key, $options: "i" },
      });
      console.log(categories);
      res.render("category", { categories: categories });
    } catch (error) {
      console.log(error.message);
    }
  };

module.exports = {
    postCategory,
    putCategory,
    deleteCategory,
    getCategory,
    getEditCategory,
    searchCategory,
}