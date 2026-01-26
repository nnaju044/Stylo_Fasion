import express from "express";
import passport from "passport";

const router = express.Router();

/* --------------------  Redirect user to Google -------------------- */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

/* --------------------  Google callback -------------------- */

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/register",
  }),
  (req, res) => {
    req.session.user = {
      id: req.user._id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      role: req.user.role,
      profileImage: req.user.profileImage || req.user.googleImage || null,
    };

    res.redirect("/");
  },
);

export default router;
