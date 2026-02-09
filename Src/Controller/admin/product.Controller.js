import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";
import Material from "../../models/material.model.js";
import Variant from "../../models/variant.model.js";
import {productSchema, variantSchema} from "../../validators/product.validator.js";
import { success } from "zod";



export const getCategoriesForDropdown = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false })
    .select("_id name")
    .lean();

  res.json({ categories });
  } catch (error) {

    console.log(error)
    
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
    
  }
};

export const getProductManagment = async (req, res) => {
  try {
    const material = await Material.find({ isDeleted: false }).lean();
    const categories = await Category.find({ isDeleted: false }).lean();

    const products = await Product.find({ isDeleted: false })
      .populate("categoryId", "name")
      .lean();

    const productIds = products.map(p => p._id);

    const variants = await Variant.find({
      productId: { $in: productIds }
    }).lean();

    const variantsByProduct = {};
    variants.forEach(v => {
      const key = v.productId.toString();
      if (!variantsByProduct[key]) variantsByProduct[key] = [];
      variantsByProduct[key].push(v);
    });

    products.forEach(p => {
      p.variants = variantsByProduct[p._id.toString()] || [];
    });

    res.render("admin/product", {
      title: "Product | Admin | Stylo Fashion",
      layout: "layouts/auth",
      products,
      material,
      categories,
      totalProduct: products.length
    });

  } catch (error) {
    console.log("error from getProductManagment", error);
  }
};


export const addProduct = async (req,res) => {
    try {
        console.log("productcontroller reached")
        const {product,variants} = JSON.parse(req.body.data);
        
      console.log("controller.body :",product,variants);

        productSchema.parse(product);
        variants.forEach(v => variantSchema.parse(v));

        
        const createdProduct = await Product.create({
            categoryId: product.category,
            name: product.name,
            description: product.description,
            isActive: product.isActive ?? true
        });

        console.log("controller.createProduct :",createdProduct);

        const filesByVariant = {};
        (req.files || []).forEach(file => {
            const match = file.fieldname.match(/variantImages_(\d+)/);
            if(!match) return;

            const idx = Number(match[1]);
        if(!filesByVariant[idx]) filesByVariant[idx] = [];
        filesByVariant[idx].push(file.path);
        });

        const variantDocs = variants.map((v,idx) =>{
            const images = filesByVariant[idx] || [];
            if(images.length < 3){
                throw new Error(`Variant ${v.sku} requires at least 3 images`);
            }

            return {
                productId: createdProduct._id,
                ...v,
                images
            };
        });

        await Variant.insertMany(variantDocs);

        res.json({success:true});
    } catch (error) {
        console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
    };



export const updateProduct = async (req,res) => {
    const updateData = {...req.body};

    if(req.files?.length) {
        updateData.images = req.files.map(file => file.path);
    }

    await Product.findByIdAndUpdate(req.params.id,updateData);

    res.json({success:true})
};

