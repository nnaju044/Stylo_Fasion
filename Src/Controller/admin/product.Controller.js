import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";
import Material from "../../models/material.model.js";
import Variant from "../../models/variant.model.js";
import mongoose from "mongoose";
import {
  productSchema,
  variantSchema,
} from "../../validators/product.validator.js";

export const getCategoriesForDropdown = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false })
      .select("_id name")
      .lean();

    res.json({ categories });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getMaterialsForDropdown = async (req, res) => {
  try {
    const materials = await Material.find({ isDeleted: false })
      .select("_id name color")
      .lean();

    res.json({ materials });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProductManagment = async (req, res) => {
  try {
    const keyword = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const query = keyword ? { name: { $regex: keyword, $options: "i" } } : {};
    const finalQuery = { isDeleted: false, ...query };

    const totalCount = await Product.countDocuments(finalQuery);

    const totalPages = Math.ceil(totalCount / limit);
    const material = await Material.find({ isDeleted: false }).lean();
    const categories = await Category.find({ isDeleted: false }).lean();

    const products = await Product.find(finalQuery)
      .populate("categoryId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const productIds = products.map((p) => p._id);

    const variants = await Variant.find({
     productId: { $in: productIds },
      isDeleted: false
      }).lean();

    const variantsByProduct = {};

    variants.forEach((v) => {
      const key = v.productId.toString();
      if (!variantsByProduct[key]) variantsByProduct[key] = [];
      variantsByProduct[key].push(v);
    });

    products.forEach((p) => {
      p.variants = variantsByProduct[p._id.toString()] || [];
    });

    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      const formattedProducts = products.map((product) => {

  const variants = product.variants || [];

  const totalStock = variants.reduce((sum, variant) => {

  const variantStock = variant.sizes.reduce(
    (s, sizeObj) => s + sizeObj.stock,
    0
  );

  return sum + variantStock;

}, 0);

  const prices = variants.map(v => v.price);

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const previewImage = variants[0]?.images?.[0] || null;

  return {
    _id: product._id,
    name: product.name,
    categoryId: product.categoryId,
    totalStock,
    minPrice,
    maxPrice,
    previewImage
  };

});
      return res.json({
        success: true,
        products: formattedProducts,
        totalPages,
        currentPage: page
      });
    }

    res.render("admin/product", {
      activePage:'product',
      title: "Product | Admin | Stylo Fashion",
      layout: "layouts/auth",
      products,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      keyword,
      material,
      categories,
      totalProduct: products.length,
    });
  } catch (error) {
    console.log("error from getProductManagment", error);
    next(error);
  }
};

export const addProduct = async (req, res) => {
  console.log("req.body:", req.body);
  try {
    console.log("productcontroller reached");
    const { product, variants } = JSON.parse(req.body.data);

    console.log("controller.body :", product, variants);

    productSchema.parse(product);
    console.log("productShema done");
    variants.forEach((v) => {

  v.price = Number(v.price);

  v.sizes = v.sizes.map(s => ({
    size: Number(s.size),
    stock: Number(s.stock),
    sku: s.sku
  }));

  variantSchema.parse(v);

});
    console.log("before adding product");

    const createdProduct = await Product.create({
      categoryId: product.category,
      name: product.name,
      description: product.description,
      isActive: product.isActive ?? true,
    });

    console.log("controller.createProduct :", createdProduct);

    const filesByVariant = {};
    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/variantImages_(\d+)/);
      if (!match) return;

      const idx = Number(match[1]);
      if (!filesByVariant[idx]) filesByVariant[idx] = [];
      filesByVariant[idx].push(file.path);
    });

    const variantDocs = variants.map((v, idx) => {
      const images = filesByVariant[idx] || [];
      if (images.length < 3) {
        throw new Error(`Variant requires at least 3 images`);
      }

      return {
  productId: createdProduct._id,
  metal: v.metal,
  price: v.price,
  sizes: v.sizes,
  images,
};
    });

    await Variant.insertMany(variantDocs);

    res.json({ success: true });
  } catch (err) {
    console.error("Controller Error:", err);
    next(error);

    if (err.name === "ZodError" && err.errors) {
      return res.status(400).json({
        success: false,
        message: err.errors.map((e) => e.message).join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name")
      .lean();

      console.log("product from getProductById",product);

   const variants = await Variant.find({
 productId: product._id,
 isDeleted:false
}).lean();

    res.json({
      product,
      variants,
    });
  } catch (error) {
    console.log("error from getProductById", error);
    next(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log("updateProduct reached");

    if (!req.body.data) {
      return res.status(400).json({ message: "No data received" });
    }

    const parsed = JSON.parse(req.body.data);
    console.log("step 7 ",parsed);

    const product = parsed.product;
    const variants = parsed.variants || [];

    console.log("step 8 ",product,"and",variants);

    productSchema.parse(product);
    console.log("step 9 schema completed");

    await Product.findByIdAndUpdate(
      req.params.id,
      {
        categoryId: product.category,
        name: product.name,
        description: product.description,
        isActive: product.isActive,
      },
      { new: true },
    );

    const existingVariants = variants.filter((v) => v.isExisting);
    const newVariants = variants.filter((v) => !v.isExisting);

    for (const v of existingVariants) {

  v.price = Number(v.price);

  v.sizes = v.sizes.map(s => ({
    size: Number(s.size),
    stock: Number(s.stock),
    sku: s.sku
  }));

  await Variant.findByIdAndUpdate(
    v._id,
    {
      metal: v.metal,
      price: v.price,
      sizes: v.sizes
    },
    { new: true }
  );

}

    const filesByVariant = {};

    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/variantImages_(\d+)/);
      if (!match) return;

      const idx = Number(match[1]);
      if (!filesByVariant[idx]) filesByVariant[idx] = [];
      filesByVariant[idx].push(file.path);
    });

    const newVariantDocs = newVariants.map((v) => {
      const actualIdx = variants.indexOf(v);
      const images = filesByVariant[actualIdx] || [];

      if (images.length < 3) {
        throw new Error("Each new variant requires at least 3 images");
      }

      const sizesWithSKU = v.sizes.map(s => {
        const size = Number(s.size);
    const stock = Number(s.stock);

    const sku =
      s.sku ||
      `${product.name}-${v.metal}-${size}`
        .toUpperCase()
        .replace(/\s+/g, "-");

    return { size, stock, sku };
      });

      return {
  productId: req.params.id,
  metal: v.metal,
  price: Number(v.price),
  sizes: sizesWithSKU,
  images
};
    });

    if (newVariantDocs.length) {
      await Variant.insertMany(newVariantDocs);
    }

    res.json({ success: true });
  } catch (error) {
    console.log("error from updateProduct", error);
    next(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    await Variant.updateMany({ productId: req.params.id }, { isDeleted: true });

    res.json({ success: true });
  } catch (error) {
    console.log("error catched from deleteProduct router", error);
    next(error);
  }
};

