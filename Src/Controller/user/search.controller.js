import Product from "../../models/product.model.js";
import Variant from "../../models/variant.model.js";
import Material from "../../models/material.model.js";

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.redirect("/");
    }

    const regex = new RegExp(q, "i");

    // 1️⃣ Find matching variants (metal search)
    const variants = await Variant.find({
      metal: regex,
      isActive: true,
      isDeleted: false,
    }).select("productId");

    const variantProductIds = variants.map((v) => v.productId);

    // 2️⃣ Find products
    const products = await Product.find({
      isActive: true,
      isDeleted: false,
      $or: [
        { name: regex },
        { description: regex },
        { _id: { $in: variantProductIds } },
      ],
    });

    // 3️⃣ Format like your category logic
    const productData = await Promise.all(
      products.map(async (product) => {
        const validVariants = await Variant.find({
          productId: product._id,
          isActive: true,
          isDeleted: false,
        });

        if (!validVariants.length) return null;

        const minPrice = Math.min(...validVariants.map((v) => v.price));
        const firstImage = validVariants[0].images[0];

        const metalNames = [...new Set(validVariants.map((v) => v.metal))];

        const metalDocs = await Material.find({
          name: { $in: metalNames },
        });

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
      title: `Search: ${q} || Stylo Fashion`,
      category: null,
      metal: await Material.find({ isDeleted: false }),
      products: productData.filter(Boolean),
      searchQuery: q,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/user/errorPage");
  }
};
