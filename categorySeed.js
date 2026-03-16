// import mongoose from "mongoose";
// import Category from "./Src/models/category.model.js";

// mongoose.connect("mongodb://127.0.0.1:27017/yourDBName");

// const categories = [
//   {
//     name: "Gold Jewellery",
//     description: "Traditional and modern gold jewellery including rings, necklaces, bangles, and earrings.",
//     isActive: true
//   }
// ];

// const seedCategories = async () => {
//   try {
//     await Category.insertMany(categories);
//     console.log("✅ Gold category added successfully");
//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// seedCategories();


// import mongoose from "mongoose";
// import Material from "./Src/models/material.model.js";
// import dotenv from "dotenv";

// dotenv.config();

// await mongoose.connect(process.env.MONGO_URI);

// await Material.create({
//   name: "Rose Gold",
//   color: "#E0BFB8"
// });


// console.log("✅ Test metal created");
// process.exit();


import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "./Src/models/productReview.model.js";

dotenv.config();

async function seedReviews(){

await mongoose.connect(process.env.MONGO_URI);

const reviews = [
{
productId:"69a8358ca28c8549868b14e1",
userId:"507f1f77bcf86cd799439011", 
rating:5,
comment:"Beautiful ring! Amazing quality."
},
{
productId:"69a8358ca28c8549868b14e1",
userId:"507f1f77bcf86cd799439012",
rating:4,
comment:"Very elegant design."
},
{
productId:"69a8358ca28c8549868b14e1",
userId:"507f1f77bcf86cd799439013", 
rating:5,
comment:"Perfect gift!"
}
];

await Review.insertMany(reviews);

console.log("Reviews inserted");

process.exit();
}

seedReviews();