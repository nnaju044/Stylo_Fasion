import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";
import cloudinary from "../../../config/cloudinary.js";


export const getCategoryManagment = async (req, res) => {
  try {
    const keyword = req.query.q || "";
    const limit = 5;
    const page = parseInt(req.query.page) || 1;

    const totalCategories = await Category.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(totalCategories / limit);

    const categories = await Category.find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    for (let category of categories) {
      console.log("category for :",category);
      category.productCount = await Product.countDocuments({
        categoryId: category._id,
        isDeleted: false
      });
    }

    
    res.render("admin/category", {
      title: "Category | admin | Stylo Fasion",
      layout: "layouts/auth",
      categories,
      currentPage: page,
      totalPages,
      keyword
    });

  } catch (error) {
    console.log(error);
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    
    const exists = await Category.findOne({ name });
   
    if (exists && !exists.isDeleted) {
      req.session.alert = {
  type: "error",
  message: "Category already exists"
};
      return res.json({ success: false, message: "Category already exists" });
    }

    if (exists && exists.isDeleted) {
        
  await Category.findOneAndUpdate(
  { _id: exists._id },
  {
    $set: {
      isDeleted: false,
      isActive: true
    }
  }
);

   req.session.alert = {
  type: "Success",
  message: "Category Created succesfully"
};

  return res.json({success: true,});
}

    const newCategory = new Category({
      name,
      isActive,
      image: req.file.path,
      publicId: `stylo/products/${req.file.filename.split('.')[0]}`,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });

  } catch (err) {
    console.log("error from addCategory",err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const editCategory = async (req, res) => {
  try {
    console.log("path:", req.file.path);
console.log("filename:", req.file.filename);

    const {id} = req.params;
    const { name, isActive } = req.body;


    const category = await Category.findById(id);

    if(!category){
      return res.status(404).json({
        success:false,
        message:"Category not found",
      });
    }

    if(req.file) {
      if(category.publicId){
        await cloudinary.uploader.destroy(category.publicId);
      }
    }

     const existingCategory = await Category.findOne({
      name,
      isDeleted:false,
      _id: { $ne: id },
    });

    if (existingCategory) {
      console.log("existing category if")
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }

    if(req.file){
      category.image = req.file.path;
      category.publicId = `stylo/products/${req.file.filename.split('.')[0]}`;
    }
    category.name = name;
    category.isActive = isActive;

    await category.save();

    res.json({ success: true  , message:"Category updated successfully"});

  } catch (err) {
    console.log("error from editCategory:",err);
    res.status(500).json({ success: false });
  }
};

export const softDeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    await Category.findByIdAndUpdate(categoryId, {
      isDeleted: true,
      isActive: false
    });

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false });
  }
};

export const searchCategories = async (req, res) => {
  try {
    const keyword = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

   const query = {
  isDeleted: false,
  ...(keyword && {
    name: { $regex: keyword, $options: "i" }
  })
};

    const totalCount = await Category.countDocuments(query);

    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    for (let category of categories) {
      category.productCount = await Product.countDocuments({
        categoryId: category._id,
        isDeleted: false
      });
    }
    console.log("category from searchCategories:",categories);

    res.json({
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ categories: [], totalPages: 0 });
  }
};



