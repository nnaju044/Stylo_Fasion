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
  console.log("isAuth worked ");
  try {
    // 1. Session check
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.redirect('/user/login');
    }

    // 2. User existence check
    const user = await User.findById(req.session.user.id);

    if (!user) {
      req.session.user = null;
      return res.redirect('/user/login');
    }

    // 3. Blocked user check
    if (!user.isActive) {
      req.session.user = null;
      return res.redirect('/user/blocked')
    }

    // 4. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.redirect('/user/login');
  }
};

export default isAuth;


