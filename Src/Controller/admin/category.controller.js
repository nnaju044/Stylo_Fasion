import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";
export const getCategoryManagment = async (req, res) => {
  try {
    const limit = 5;
    const page = parseInt(req.query.page) || 1;

    const totalCategories = await Category.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(totalCategories / limit);

    const categories = await Category.find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    for (let category of categories) {
      category.productCount = await Product.countDocuments({
        category: category._id,
        isDeleted: false
      });
    }
console.log({ page, totalPages, totalCategories });

    res.render("admin/category", {
      title: "Category | admin | Stylo Fasion",
      layout: "layouts/auth",
      categories,
      currentPage: page,
      totalPages
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
      .limit(limit);

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



