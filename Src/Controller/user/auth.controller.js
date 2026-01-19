import Otp from "../../models/otp.model.js";
import User from "../../models/user.model.js";
import { loginService, registerService } from "../../services/auth.service.js";
import { sendOtpService } from "../../services/sendOtp.service.js";
import { hashOTP } from "../../utils/otp.utils.js";

export const getUserLogin = (req, res) => {
  res.render("users/auth/login", {
    title: "Login | Stylo Fasion",
    layout: "layouts/auth",
  });
};

export const postUserLogin = async (req,res) =>{
 try {
   const {email,password} = req.body;

    const result = await loginService({model:User,email,password});
  
  if(!result.success){
    res.locals.alert ={
      mode:"swal",
      type:"error",
      title:"Login failed",
      message:result.message
    }
    return res.render("users/auth/login", {
      title: "Login | Stylo Fasion",
      layout: "layouts/auth"
    });
  }

  req.session.user = {
    id: result.data._id,
    email: result.data.email,
    role: result.data.role
  };
  res.redirect(303,"/")

 } catch (error) {
  console.error("Registration error:", error);
    return res.render("users/auth/login", {
      title: "Login | Stylo Fasion",
      layout: "layouts/auth",
      alert: {
        mode: "swal",
        type: "error",
        title: "Registration Failed",
        message: error.message || "An error occurred during login",
      },
    });

  
 }
}

export const getUserSignup = (req, res) => {
  res.render("users/auth/signup", {
    title: "Signup | Stylo Fasion",
    layout: "layouts/auth",
  });
};

export const postUserSignup = async (req, res) => {
  try {
    const user = await registerService(req.body);
    await sendOtpService({
      userId: user._id,
      purpose: "signup",
      email: user.email,
    });

    req.session.otpUser = user._id;
    res.redirect("/user/verify-otp");

  } catch (error) {
    console.error("Registration error:", error);
    return res.render("users/auth/signup", {
      title: "Signup | Stylo Fasion",
      layout: "layouts/auth",
      alert: {
        mode: "swal",
        type: "error",
        title: "Registration Failed",
        message: error.message || "An error occurred during registration",
      },
    });
  }
};

export const getVerifyOtp = async (req, res) => {
  if (!req.session.otpUser) return res.redirect("/user/signup");

  res.render("users/auth/otp", {
    title: "verify-otp | Stylo Fasion",
    layout: "layouts/auth",
  });
};

export const postVerifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.session.otpUser;

    if(!userId) throw new Error("Session expired. Please signup again.")

    const record = await Otp.findOne({
      userId,
      purpose: "signup",
      isUsed: false,
    });

    if (!record) throw new Error("Otp not found");
    if (record.expiresAt < Date.now()) throw new Error("Otp Expired");
    if (hashOTP(otp) !== record.otp) throw new Error("Invalid Otp");

    record.isUsed = true;
    await record.save();

    
    const user = await User.findByIdAndUpdate(userId, { isVerified: true });
    
    req.session.user = {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      isVerified:true
    };
    
    delete req.session.otpUser;

    res.redirect("/");
  } catch (error) {
    if (req.session.otpUser) {
      await User.findByIdAndDelete(req.session.otpUser);
      await Otp.deleteMany({ userId: req.session.otpUser });
      delete req.session.otpUser;
    }

    res.render("users/auth/otp", {
      title: "Verify OTP",
      layout: "layouts/auth",
      alert: {
        mode: "swal",
        type: "error",
        title: "OTP Error",
        message: error.message,
      },
    });
  }
};

export const getForgetPassword = async (req,res) =>{
  res.render('users/auth/forgetPassword',{
    title: "Forget Password | Stylo Fasion",
    layout:"layouts/auth"
  })
}
