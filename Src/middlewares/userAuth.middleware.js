export const requireVerifiedUser = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  if (!req.session.user.isVerified) {
    return res.redirect("/verify-otp");
  }
  next();
};