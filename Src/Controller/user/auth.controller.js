
import { registerService } from "../../services/auth.service.js";

export const getUserLogin = (req, res) => {
  res.render("users/auth/login", {
    title: "Login | Stylo Fasion",
    layout: "layouts/auth",
  });
};

export const getUserSignup = (req, res) => {
  res.render("users/auth/signup", {
    title: "Signup | Stylo Fasion",
    layout: "layouts/auth",
  });
};

export const postUserSignup = async (req, res) => {

  try {
    const user = await registerService(req.body);
    req.session.user ={
      id:user._id,
      name:`${user.firstName} ${user.lastName}`,
      email:user.email,
      role:user.role
    }

    res.redirect("/")

  } catch (error) {
    console.error("Registration error:", error);
    return res.render("users/auth/signup", {
      title: "Signup | Stylo Fasion",
      layout: "layouts/auth",
      alert: {
        mode: "swal",
        type: "error",
        title: "Registration Failed",
        message: error.message || "An error occurred during registration"
      }
    });
  }
};
