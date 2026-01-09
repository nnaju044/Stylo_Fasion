import mongoose from "mongoose";

const adminScema = new mongoose.Schema(
  {
    name: {
        type: String,
        required:true,
        trim:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      requred: true,
    },
    role: {
      type: String,
      default: "admin",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Admin",adminScema)
