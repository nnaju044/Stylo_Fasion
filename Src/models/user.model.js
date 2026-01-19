import mongoose from "mongoose";

const usesrSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    profilePicture: {
      type: String,
    },
    referredBy: {
      type: String,
    },
    referralCode: {
      type: String,
    },
    referrals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default:[]
    },
    walletBalance: {
      type: Number,
      default:0
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "user",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", usesrSchema);
