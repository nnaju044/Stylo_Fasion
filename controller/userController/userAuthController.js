export const userLogin = async (req, res) => {
  // after validating email & password

  req.session.user = {
    id: user._id,
    role: "user"
  };

  res.redirect("/");
};
