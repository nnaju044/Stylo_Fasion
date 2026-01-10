
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
    await registerService(req.body);

    res.render("users/auth/login", {
      title: "login | Stylo Fasion",
      layout: "layouts/auth",
      alert: {
        mode: "swal",
        type: "success",
        title: "Account Created",
        message: "Your account has been created successfully. Please login."
      }
    });
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
