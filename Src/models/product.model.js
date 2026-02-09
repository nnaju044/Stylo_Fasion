import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true 
  }
);
export default mongoose.model("Product", productSchema);
