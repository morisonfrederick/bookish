const Order = require("../../models/orderModel")
const Books = require("../../models/bookModel")
const ExcelJS = require("exceljs")



const saleReportLoad = async function(req,res){
    let salesReport =await createSalesReport()
    let products = await mostSellingProducts()
    console.log("most selling products",products);

    console.log("second",salesReport);
    
    res.render("salesReport",{Mproducts:0,sales:0, salesReport,products})
}

// const createSalesReport = async function(){
//     let totalOrders = await Order.find()
//     let totalSale = 0
//     let totalMoneyRecieved = 0
    

//     totalOrders.forEach(order => {
//         order.products.forEach(product => {
//             totalSale += product.quantity;
//         });
//     });
//     totalOrders.forEach(order => {
//         totalMoneyRecieved += order.totalPrice
//     })
//     console.log("first",totalSale);
    
//     let profit = totalMoneyRecieved * 0.2
//     let salesReport = {
//         totalSale,
//         totalMoneyRecieved,
//         profit
//     }
//     return salesReport
// }

const createSalesReport = async function(){
  try{
    let products = await Order.aggregate([
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: "$products.product",
          totalQuantity: {$sum: "$products.quantity"},
          totalPrice : {$sum: {$multiply: ["$products.price","$products.quantity"]}}
        }
      },
      {
        $lookup: {
          from: "books", // Assuming "books" is the collection name for products
          localField: "_id",
          foreignField: "_id",
          as: "productData", // Store product details in "productData" field
      }
      },
      {
        $addFields: {
          productName: { $arrayElemAt: ["$productData.name", 0] }, // Get the product name from productData array
          profit: { $multiply: ["$totalPrice", 0.2] }
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field if not needed
          totalQuantity: 1,
          totalPrice: 1,
          productName: 1,
          profit: 1,
        },
      },

    ])
    return products

  }
  catch(err){
    console.log(err);
  }
  
}

const mostSellingProducts = async function(){
    let products = await Order.aggregate([
        {
          $unwind: "$products", // Unwind the products array
        },
        {
          $group: {
            _id: "$products.product", // Group by product ID
            totalQuantity: { $sum: "$products.quantity" }, // Calculate total quantity sold
            totalPrice: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }, // Calculate total sales value per product
          },
        },
        {
          $lookup: {
            from: "books", // Assuming "books" is the collection name for products
            localField: "_id",
            foreignField: "_id",
            as: "productData", // Store product details in "productData" field
          },
        },
        {
          $addFields: {
            productName: { $arrayElemAt: ["$productData.name", 0] }, // Get the product name from productData array
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field if not needed
            totalQuantity: 1,
            totalPrice: 1,
            productName: 1,

          },
        },
        {
          $sort: { totalQuantity: -1 }, // Sort by total quantity sold in descending order
        },
        {
          $limit: 4, // Limit to the top 6 products
        },
      ])
      return products
}

const excelSheet = async function(req,res){
  let salesReport =await createSalesReport()
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sales report');
  sheet.columns = [
    { header: "Product Name", key: "productName", width: 25 },
    { header: "Quantity", key: "quantity", width: 15 },
    { header: "Price", key: "price", width: 15 },
    { header: "Profit", key: "profit", width: 15 },
  ];
  salesReport.forEach((salesReport)=>{
      sheet.addRow({
      productName: salesReport.productName,
      price : salesReport.totalPrice,
      profit: salesReport.profit,
      quantity: salesReport.totalQuantity
    })
  })
  

  // Stream the Excel file to the client as a response
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=sales_report.xlsx"
  );

  workbook.xlsx.write(res).then(() => {
    res.end();
  });
}



module.exports = {
    saleReportLoad,
    excelSheet
}