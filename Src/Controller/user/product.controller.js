import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";
import Variant from "../../models/variant.model.js";
import Material from "../../models/material.model.js";

export const getProductsByCategory = async (req, res) => {
  try {
    const metal = await Material.find({ isDeleted: false });
    const { categoryId } = req.params;

    const category = await Category.findOne({
      _id: categoryId,
      isActive: true,
      isDeleted: false,
    });

    if (!category) {
      return res.redirect("/");
    }

    const products = await Product.find({
      categoryId: category._id,
      isActive: true,
      isDeleted: false,
    });

    const productData = await Promise.all(
      products.map(async (product) => {
        const variants = await Variant.find({
          productId: product._id,
          isActive: true,
          isDeleted: false,
        });

        if (!variants.length) return null;

        const minPrice = Math.min(...variants.map((v) => v.price));

        const metalNames = [...new Set(variants.map((v) => v.metal))];

        const metalDocs = await Material.find({ name: { $in: metalNames } });

        const firstImage = variants[0].images[0];

        return {
          _id: product._id,
          name: product.name,
          price: minPrice,
          image: firstImage,
          metals: metalDocs,
        };
      }),
    );
    res.render("users/product/product-list", {
      title: `${category.name} || Stylo Fashion`,
      category,
      metal,
      products: productData.filter(Boolean),
      searchQuery: null,
    });
  } catch (error) {
    res.redirect("/user/errorPage");
    console.log("Error from product.controller:", error);
    res.status(500).send("Server Error");
  }
};

export const getProductsByCategoryAPI = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { size, metal, min, max } = req.query;

    const products = await Product.find({
      categoryId,
      isActive: true,
      isDeleted: false,
    });

    const productData = await Promise.all(
      products.map(async (product) => {
        const variantFilter = {
          productId: product._id,
          isActive: true,
          isDeleted: false,
        };

        if (size) variantFilter.size = Number(size);
        if (metal) variantFilter.metal = metal;
        // only apply price range when both query params are provided and valid numbers
        if (min !== undefined && max !== undefined && min !== '' && max !== '') {
          const minNum = Number(min);
          const maxNum = Number(max);
          if (!isNaN(minNum) && !isNaN(maxNum)) {
            variantFilter.price = {
              $gte: minNum,
              $lte: maxNum,
            };
          }
        }

        const variants = await Variant.find(variantFilter);

        if (!variants.length) return null;

        const metalNames = [...new Set(variants.map((v) => v.metal))];

        const metalDocs = await Material.find({
          name: { $in: metalNames },
        });

        return {
          _id: product._id,
          name: product.name,
          price: Math.min(...variants.map((v) => v.price)),
          image: variants[0].images[0],
          metals: metalDocs,
        };
      }),
    );

    res.json({
      success: true,
      products: productData.filter(Boolean),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};
