import mongoose from "mongoose";


const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: String,
    phone: String,

    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: "India"
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Address",addressSchema)