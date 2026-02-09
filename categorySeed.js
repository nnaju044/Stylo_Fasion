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


import mongoose from "mongoose";
import Material from "./Src/models/material.model.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Material.create({
  name: "Gold",
  color: "#D4AF37"
});

console.log("✅ Test metal created");
process.exit();



