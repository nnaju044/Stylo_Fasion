import User from "../models/user.model.js";        
/* -------------------- CHECK VERIFIED MIDDLEWARE -------------------- */

export const requireVerifiedUser = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  if (!req.session.user.isVerified) {
    return res.redirect("/verify-otp");
  }
  next();
};

/* -------------------- ATTACHING USER MIDDLEWARE -------------------- */

export const attachUser = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

/* -------------------- AUTHENTICATION VERIFY MIDDLEWARE -------------------- */

export const isAuth = async (req, res, next) => {
  try {
    if (!req.session?.user?.id) {
      return res.redirect("/user/login");
    }

    const user = await User.findById(req.session.user.id);

    if (!user || !user.isActive) {
      return req.session.destroy(() => {
        res.redirect("/user/login");
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    res.redirect("/user/login");
  }
};

export const preventAuth = (req, res, next) => {
  if (req.session?.user?.id) {
    return res.redirect("/");
  }
  next();
};

export default isAuth;


