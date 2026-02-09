import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let user = null;

    if (req.session?.user?.id) {
      user = await User.findById(req.session.user.id).lean();
    }

    res.render("users/home", {
      title: "Home | Stylo Fashion",
      user
    });
  } catch (error) {
   console.log("error from landing",error);
    next(error);
  }
});

export default router;
