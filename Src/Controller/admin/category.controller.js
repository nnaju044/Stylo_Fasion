import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";

export const getCategoryManagment = async (req,res)=>{

    try {
    const categories = await Category.find({ isDeleted: false }).lean();

    console.log(categories);

    // attach product count for each category
    for (let category of categories) {
      category.productCount = await Product.countDocuments({
        category: category._id,
        isDeleted: false
      });
    }

    res.render("admin/category", {
         title:'Category | admin | Stylo Fasion',
        layout:'layouts/auth',
      categories
    });

  } catch (error) {
    console.log(error);
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;

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
  message: "Category Created succesful"
};

  return res.json({success: true,});
}

    await Category.create({ name, isActive });
    res.json({ success: true });

  } catch (err) {
    res.json({ success: false });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    await Category.findByIdAndUpdate(req.params.id, {
      name,
      isActive
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false });
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


