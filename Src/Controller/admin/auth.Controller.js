import Admin from "../../models/admin.model.js";
import { loginService } from "../../services/auth.service.js";

export const getAdminLogin = (req, res) => {
  res.render("admin/login.ejs", {
    title: "Home | Stylo Fashion",
    layout: "layouts/auth",
  });
};

export const postAdminLogin = async (req, res) => {

    const { email, password } = req.body;

    const result = await loginService({ model:Admin, email, password });

    if (!result.success) {
      res.locals.alert = {
        type: "error",
        title: "Login Failed",
        message: result.message,
      };
      return res.render('admin/login',{
        title:"admin login",
        layout: "layouts/auth"
      })
    }

    req.session.admin = {
      id: result.data._id,
      email: result.data.email,
      role: result.data.role,
    };
    res.redirect(303, "/admin/dashboard");
   
};

export const getDashboard = async (req, res) => {


  res.locals.alert = {
    type: "success",
    title: "login successful",
    message: "welcome !!",
  };
  res.render("admin/dashboard", {
    error: "working dashboard",
    title: "Admin dashboard",
    layout: "layouts/auth",
  });
};
