
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


export default function isAuth(req, res, next) {
  try {
   
    if (!req.session || !req.session.userId) {
      return res.redirect("/user/login");
    }

    next(); 
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.redirect("/user/login");
  }
}

