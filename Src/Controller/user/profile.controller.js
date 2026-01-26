import User from "../../models/user.model.js";
import Otp from "../../models/otp.model.js";
import Address from "../../models/address.model.js";
import { addressSchema } from "../../validators/address.schema.js";
import { updateAllProfileSchema , updateEmailSchema } from "../../validators/profile.schema.js";
import { sendOtpService } from "../../services/sendOtp.service.js";
import { verifyOtpService } from "../../services/verifyOtp.servicer.js";
import bcrypt from "bcrypt"


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    const user = await User.findById(userId).populate("referrals", "_id");

    if (!user) {
      return res.redirect("/user/login");
    }

    res.render("users/profile/profile", {
      title: "profile | Stylo Fasion",
      user,
      totalReferrals: user.referrals?.length || 0,
    });
  } catch (error) {
    console.log("error from profile", error);
    res.status(500).send("Server Error");
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    const addresses = await Address.find({ userId });

    res.render("users/profile/address", {
      title: "Address | JStylo Fasion",
      addresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

export const addUserAddress = async (req, res) => {
  try {
    console.log("user exist ", req.session.user.id);
    const userId = req.session.user?.id;

    const parsed = addressSchema.safeParse(req.body);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map(err => err.message)
        .join(", ");

      req.session.alert = {
        mode: "swal",
        type: "error",
        title: "Validation Error",
        message,
      };

      return res.redirect("/user/addresses");
    }

    await Address.create({
      userId,
      ...parsed.data,
      country: "India",
    });

    req.session.alert = {
      mode: "toast",
      type: "success",
      message: "Address added successfully",
    };

    res.redirect("/user/addresses");
  } catch (error) {
    req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Fail to Add",
      message: error.message || "Internal Server Error",
    };
    res.redirect("/user/addresses");
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const addressId = req.params.id;

    if (!userId) return res.redirect("/user/login");

    const parsed = addressSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map(err => err.message)
        .join(", ");

      req.session.alert = {
        mode: "swal",
        type: "error",
        title: "Validation Error",
        message,
      };

      return res.redirect("/user/addresses");
    }

    await Address.updateOne({ _id: addressId, userId }, { $set: parsed.data });

    req.session.alert = {
      mode: "toast",
      type: "success",
      message: "Address updated successfully",
    };

    res.redirect("/user/addresses");
  } catch (error) {
    req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Update Failed",
      message: "Please try again later",
    };
    res.redirect("/user/addresses");
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const addressId = req.params.id;

    await Address.deleteOne({
      _id: addressId,
      userId,
    });

    req.session.alert = {
      mode: "toast",
      type: "success",
      message: "Address deleted successfully",
    };

    res.redirect("/user/addresses");
  } catch (error) {
    req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Delete Failed",
      message: "Please try again later",
    };
    res.redirect("/user/addresses");
  }
};

export const sendEmailOtp = async (req, res) => {

  const parsed = updateEmailSchema.safeParse(req.body);
  console.log("parsed:",parsed)

  if (!parsed.success) {
    console.log("!parsed.success")
      const message = parsed.error.issues
        .map(err => err.message)
        .join(", ");

      req.session.alert = {
        mode: "swal",
        type: "error",
        title: "basic update Error",
        message,
      };

      return res.redirect("/user/profile");
    }

    const { email } = parsed.data;
    const user = await User.findOne({ email });
    
    if (user) throw new Error("Email already exist");

    console.log(email)

    req.session.pendingEmail = email;

    req.session.otpUser = req.session.user.id;
      req.session.otpPurpose = "email-update";
       const userId = req.session.user.id;

       await sendOtpService({
        userId,
        purpose: "email-update",
        email: email,
      });

      console.log("send otp successfully")
      
    
      req.session.alert ={
        mode:"toast",
        type:"success",
        title:"OTP",
        message:"OTP Send Successfully"
      }

      res.json({ success: true });
      
      
};

export const verifyEmailOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.session.pendingEmail;
  const userId = req.session.user.id;

  if (!otp || !email) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const isValid = await verifyOtpService({
    userId,
    otp,
    purpose: "email-update"
  });

  if (!isValid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  console.log("email for update",email)


  try {
  await User.findByIdAndUpdate(
    req.session.user.id,
    { $set: { email } },
    { runValidators: true }
  );
} catch (err) {
  console.error("Email update error:", err);
}


  const id = req.session.user.id;
  const user = await User.findOne({id});

  console.log("user:",user)

  req.session.pendingEmail = null;

  console.log("verify otp finished")

  res.json({ success: true });
};

export const updateAllProfile = async (req, res) => {
  const parsed = updateAllProfileSchema.safeParse(req.body);

   if (!parsed.success) {
      const message = parsed.error.issues
        .map(err => err.message)
        .join(", ");

      req.session.alert = {
        mode: "swal",
        type: "error",
        title: "Validation Error",
        message,
      };

      return res.redirect("/user/profile");
    }

  const {
    firstName,
    lastName,
    phone,
    currentPassword,
    newPassword
  } = parsed.data;

  const user = await User.findById(req.session.user.id);

  // ---------- UPDATE BASIC FIELDS ----------
  console.log("F:",firstName,"and",user)
  user.firstName = firstName;
  user.lastName = lastName;
  user.phone = phone;

  // ---------- PASSWORD UPDATE (OPTIONAL) ----------
  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();

  res.json({ success: true });
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    user.profileImage = req.file.path; // Cloudinary URL
    await user.save();

    res.json({
      success: true,
      imageUrl: req.file.path
    });

  } catch (error) {
    console.error("Profile image upload error:", error);
    res.status(500).json({
      message: "Image upload failed"
    });
  }
};

