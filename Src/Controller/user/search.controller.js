import Product from "../../models/product.model.js";
import Variant from "../../models/variant.model.js";
import Material from "../../models/material.model.js";
import User from "../../models/user.model.js";

export const searchProducts = async (req,res) =>{
  try {
    const userId = req.session.user?.id;
    let favoriteIds = [];

    if (userId) {
      const user = await User.findById(userId).select("favorites");
      favoriteIds = user?.favorites?.map(id => id.toString()) || [];
    }

    const {q} = req.query;
    if(!q) {
      return res.redirect("/");
    }
    const regex = new RegExp(q,"i");

    const variants = await Variant.find({
      metal:regex,
      isActive:true,
      isDeleted:false,
    })
    .select("productId")
    .lean();

    const variantProductIds = [...new Set(variants.map((v) => v.productId.toString())),];

    const products = await Product.find({
      isActive:true,
      isDeleted:false,
      $or:[
        {name:regex},
        {description:regex},
        {_id:{$in:variantProductIds}},
      ],
    }).lean();

    const allVariants = await Variant.find({
      productId:{$in:products.map((p) => p._id)},
      isActive:true,
      isDeleted:false,
    }).lean();

    const materials = await Material.find({ isDeleted:false}).lean();

    const productData = products.map((product) =>{
      const validVariants = allVariants.filter((v) => v.productId.toString()===product._id.toString(),);

      if(!validVariants.length) return null;

      const minPrice = Math.min(...validVariants.map((v)=> v.price));
      const firstImage = validVariants[0].images?.[0] || null;

      const metalNames = [...new Set(validVariants.map((v) => v.metal))];

      const metalDocs = materials.filter((m) => metalNames.includes(m.name),);

      return {
        _id:product._id,
        name:product.name,
        price:minPrice,
        image:firstImage,
        metals:metalDocs
      };
    }).filter(Boolean);

    res.render("users/product/product-list",{
      title:`search:${q} || Stylo Fashion`,
      category:null,
      metal:materials,
      products:productData,
      searchQuery:q,
      favoriteIds,
    });
  } catch (error) {
    console.log(error)
    res.redirect("/user/errorPage");
    
  }
}
