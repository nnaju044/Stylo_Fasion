import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    }
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    metal: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    sizes: {
      type: [sizeSchema],
      validate: {
        validator: v => v.length > 0,
        message: "At least one size required"
      }
    },

    images: {
      type: [String],
      validate: {
        validator: v => v.length >= 3,
        message: "Minimum 3 images required"
      }
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

variantSchema.index({ "sizes.sku": 1 }, { unique: true });

const Variant = mongoose.model("Variant", variantSchema);

export default Variant;