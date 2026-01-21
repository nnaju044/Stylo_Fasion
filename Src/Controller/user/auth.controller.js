import Otp from "../../models/otp.model.js";
import User from "../../models/user.model.js";
import { loginService, registerService, resetPasswordService } from "../../services/auth.service.js";
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
    const parsed = registerSchema.safeParse(req.body);

    
    if (!parsed.success) {
      
      const errors = parsed.error.errors.map(err => err.message);

      
      const htmlMessage = `
        <ul style="text-align:left">
          ${errors.map(e => `<li>${e}</li>`).join("")}
        </ul>
      `;
      req.session.alert = {
        mode: "swal",
        type: "error",
        title: "Password requirements",
        message: htmlMessage,
      };
       return res.redirect("/user/register");
    }


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
    const purpose = req.session.otpPurpose;
    

    if(!userId || ! purpose) throw new Error("Session expired. Please signup again.")

    const record = await Otp.findOne({
      userId,
      purpose,
      isUsed: false,
    });

    if (!record) throw new Error("Otp not found");
    if (record.expiresAt < Date.now()) throw new Error("Otp Expired");
    if (hashOTP(otp) !== record.otp) throw new Error("Invalid Otp");

    record.isUsed = true;
    await record.save();

    // For Signup
    if (purpose === "signup") {
      const user = await User.findByIdAndUpdate(
        userId,
        { isVerified: true },
        { new: true }
      );

      req.session.user = {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        isVerified: true,
      };

      delete req.session.otpUser;
      delete req.session.otpPurpose;

      return res.redirect("/");
    }
    
    // Forgot password
    if (purpose === "forgot-password") {
      req.session.allowReset = true;

      return res.redirect("/user/reset-password");
    }
   
  } catch (error) {
    if (req.session.otpPurpose === "signup" && req.session.otpUser) {
      await User.findByIdAndDelete(req.session.otpUser);
      await Otp.deleteMany({ userId: req.session.otpUser });
      delete req.session.otpUser;
      delete req.session.otpPurpose;
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
};

export const postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  

  req.session.otpUser = user._id;
  req.session.otpPurpose = "forgot-password";
   
  
  await sendOtpService({
    userId: user._id,
    purpose: "forgot-password",
    email: email,
  });
  

  req.session.alert ={
    mode:"toast",
    type:"success",
    title:"OTP",
    message:"OTP Send Successfully"
  }
  
  res.redirect("/user/verify-otp");

    
  } catch (error) {
    req.session.alert ={
      mode:"swal",
      type:"error",
      title:"Verification Failed",
      message:error.message || "Failed to send OTP"
    }
   
    return res.redirect("/user/forgot-password");
    
  }
};

export const verifyForgotOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.session.otpUser;
    const purpose = req.session.otpPurpose;
    

    if (!userId) throw new Error("Session expired");

    // REUSE OTP SERVICE
    await verifyOtp({
      userId,
      otp,
      purpose,
    });


    req.session.alert = {
      mode: "swal",
      type: "success",
      title: "Success",
      message: "OTP verified successfully"
    };
    res.redirect("/user/reset-password");
  } catch (error) {
    req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Verification Failed",
      message: error.message || "Failed to verify OTP"
    };
    res.redirect("/user/verify-otp");
  }
};

export const getResetPassword = async (req, res) => {
  if (!req.session.otpUser || req.session.otpPurpose !== "forgot-password") {

    req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Unauthorized",
      message: "Reset password session expired",
    };
    return res.redirect("/user/forgot-password");
  }

  res.render("users/auth/resetPassword", {
    title: "Reset Password | Stylo Fasion",
    layout:"layouts/auth"
  });
};

export const postResetPassword = async (req, res) =>{
  try {
    console.log(req.body)
    if (!req.session.otpUser || req.session.otpPurpose !== "forgot-password") {

    req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Unauthorized",
      message: "Reset password session expired",
    };
    console.log("redirected to forgot-password because of otpUser")
    return res.redirect("/user/forgot-password");
  }

  const result = await resetPasswordService({
    userId: req.session.otpUser,
      passwordData: req.body,
  })

  if (!result.success) {
    console.log("!result.success")
      req.session.alert = {
        mode: "swal",
        type: "error",
        title: "Password Error",
        message: `<ul style="text-align:left">
          ${result.errors.map(e => `<li>${e}</li>`).join("")}
        </ul>`,
      };

      return res.redirect("/user/reset-password");
    }

     //  Clear OTP session
    req.session.otpUser = null;
    req.session.otpPurpose = null;

    // if Success
    req.session.alert = {
      mode: "toast",
      type: "success",
      message: "Password reset successfully. Please login.",
    };
    console.log("success redirected to user/login")
    return res.redirect("/user/login");


  } catch (error) {
      req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Reset Failed",
      message: error.message || "Something went wrong",
    };
    console.log("catch finded error ",error.message)

    return res.redirect("/user/forgot-password");
  }
    
  };





