import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";
import Variant from "../../models/variant.model.js";
import Material from "../../models/material.model.js";
import Review from "../../models/productReview.model.js";
import User from "../../models/user.model.js";

export const getProductsByCategory = async (req, res) => {
  console.log("Home controller hit");
  try {
    console.log("req=",req.session.user);
    const userId = req.session.user?.id;
    let favoriteIds = [];

    if (userId) {
  const user = await User.findById(userId).select("favorites");

  favoriteIds = user?.favorites?.map(id => id.toString()) || [];
}
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

        const totalStock = variants.reduce((sum, v) => {
          return sum + (v.sizes?.reduce((s, size) => s + (size.stock || 0), 0) || 0);
        }, 0);

        return {
          _id: product._id,
          name: product.name,
          price: minPrice,
          image: firstImage,
          metals: metalDocs,
          totalStock
        };
      }),
    );
    console.log("category from controller ",category);
    console.log("favoriteIds:", favoriteIds);
    res.render("users/product/product-list", {
      title: `${category.name} || Stylo Fashion`,
      category,
      metal,
      products: productData.filter(Boolean),
      searchQuery: null,
      favoriteIds
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
    console.log("category id cjeck",categoryId);
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

        const totalStock = variants.reduce((sum, v) => {
          return sum + (v.sizes?.reduce((s, size) => s + (size.stock || 0), 0) || 0);
        }, 0);

        return {
          _id: product._id,
          name: product.name,
          price: Math.min(...variants.map((v) => v.price)),
          image: variants[0].images[0],
          metals: metalDocs,
          totalStock
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

/*---------- SINGLE PRODUCT  ---------- */

export const getSingleProductPage = async (req,res) =>{
  try {
    const {productId} = req.params;
    console.log("step-1",productId);
    const product = await Product.findOne({
      _id:productId,
    });

    if(!product) return res.redirect("/");

   const variants = await Variant.find({
  productId,
  isActive:true,
  isDeleted:false
}).sort({ metal:1, size:1 });
    console.log("step-2",variants);


    if(!variants.length) return res.redirect("/");

    const metalNames = [...new Set(variants.map(v => v.metal))];

    const metalDocs = await Material.find({
      name:{$in:metalNames}
    });

    const reviews = await Review.find({
  productId,
  isDeleted:false
})
.populate("userId","firstName profileImage")
.sort({createdAt:-1});

const relatedProducts = await Product.find({
  categoryId: product.categoryId,
  _id: { $ne: product._id },
  isActive: true,
  isDeleted: false
}).limit(4);

const relatedData = await Promise.all(
  relatedProducts.map(async (p)=>{

    const variant = await Variant.findOne({
      productId: p._id,
      isActive:true,
      isDeleted:false
    });

    if(!variant) return null;

    return {
      _id:p._id,
      name:p.name,
      price:variant.price,
      image:variant.images[0]
    }

  })
);

let avgRating = 0;

if (reviews.length > 0) {
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  avgRating = (total / reviews.length).toFixed(1);
}

    const minPrice = Math.min(...variants.map(v => v.price));
    console.log("render checking",product,variants,metalDocs,minPrice);
    const totalStock = variants.reduce((sum, v) => {
      return sum + (v.sizes?.reduce((s, size) => s + (size.stock || 0), 0) || 0);
    }, 0);

    res.render("users/product/single-product-detail",{
      title:`${product.name} || Stylo Fashion`,
      product,
      variants,
      metals:metalDocs,
      minPrice,
      reviews,
      relatedProducts: relatedData.filter(Boolean),
      avgRating,
      isAvailable: product.isActive && !product.isDeleted,
      totalStock
    });
  } catch (error) {
    console.log("Single product error",error);
    res.redirect("/user/errorPage")
    
  }
};
