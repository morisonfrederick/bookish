const Order = require("../../models/orderModel")
const Books = require("../../models/bookModel")
const ExcelJS = require("exceljs")
const Category = require("../../models/categoryModel")



const saleReportLoad = async function(req, res) {
  try {
    const { start, end } = req.query;

    // Helper function to generate random colors
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    // Initialize common variables
    let yValues = [];
    let xValues = [];
    let barColors = [];
    let xValue = [];
    let yValue = [];
    let salesReport;
    let products;
    let books;

    // Generate sales report and product data based on presence of start and end dates
    if (!start || !end) {
      salesReport = await createSalesReport();
      products = await mostSellingProducts();
      books = await getTotalBooksSoldByCategory();
    } else {
      salesReport = await createSalesReport(start, end);
      products = await mostSellingProducts();
      books = await getTotalBooksSoldByCategory(start, end);
    }

    // Process product data
    products.forEach(product => {
      xValue.push(product.productName);
      yValue.push(product.totalQuantity);
    });

    // Process book data
    books.forEach(item => {
      yValues.push(item.totalSold);
      xValues.push(item.category);
      barColors.push(getRandomColor());
    });

    // Render the sales report view with the gathered data
    res.render("salesReport", {
      Mproducts: 0,
      sales: 0,
      salesReport,
      products,
      xValues,
      yValues,
      barColors,
      xValue,
      yValue
    });
  } catch (err) {
    console.log(err);
  }
};




const createSalesReport = async function(startDate = new Date(new Date().getFullYear(), 0, 1), endDate = new Date()){
  try{
    let products = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
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

const mostSellingProducts = async function(startDate = new Date(new Date().getFullYear(), 0, 1), endDate = new Date()){
  let products = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
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
        $limit: 4, // Limit to the top 4 products
      },
    ]).exec(); // Ensure execution and return promise
    // console.log(products); // Log the results
    return products
}

// Call the function and log the output
mostSellingProducts().then(result => {
// console.log("Most Selling Products:", result);
}).catch(err => {
console.error("Error:", err);
});


const excelSheet = async function(req,res){
  try{
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
  catch(err){
      console.log(err);
  }

}

const getTotalBooksSoldByCategory = async (startDate = new Date(new Date().getFullYear(), 0, 1), endDate = new Date()) => {
  try {
      const result = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }
          },
          {
              // Unwind the products array to get individual product documents
              $unwind: "$products"
          },
          {
              // Lookup to join with the book collection
              $lookup: {
                  from: "books",
                  localField: "products.product",
                  foreignField: "_id",
                  as: "bookInfo"
              }
          },
          {
              // Unwind the bookInfo array to get individual book documents
              $unwind: "$bookInfo"
          },
          {
              // Group by category and sum the quantities
              $group: {
                  _id: "$bookInfo.category",
                  totalSold: { $sum: "$products.quantity" }
              }
          },
          {
              // Project the result to a more readable format
              $project: {
                  category: "$_id",
                  totalSold: 1,
                  _id: 0
              }
          }
      ]);

      // console.log(result);
      return result;
  } catch (error) {
      console.error("Error fetching total books sold by category:", error);
      throw error;
  }
};



module.exports = {
    saleReportLoad,
    excelSheet
}