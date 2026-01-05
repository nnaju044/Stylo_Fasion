export const adminLogin = async (req, res) => {
  // after validating admin credentials

  req.session.admin = {
    id: admin._id,
    role: "admin"
  };

  res.redirect("/admin/dashboard");
};
