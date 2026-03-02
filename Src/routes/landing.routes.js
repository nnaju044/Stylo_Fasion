import express from "express";
import User from "../models/user.model.js";
import Variant from "../models/variant.model.js";
import Category from "../models/category.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({isDeleted:false});
    const variants = await Variant.find({isDeleted:false})
    .populate("productId", "name match: { isDeleted: false }, description")
    .sort({createdAt:-1})
    .limit(8);

    const filteredVariants = variants.filter(v => v.productId);

    console.log("variants",filteredVariants);

    let user = null;

    if (req.session?.user?.id) {
      user = await User.findById(req.session.user.id).lean();
    }

    res.render("users/home", {
      title: "Home | Stylo Fashion",
      user,
      categories,
      variants:filteredVariants
    });
  } catch (error) {
    res.redirect("/user/errorPage")
   console.log("error from landing",error);
  }
});

export default router;
