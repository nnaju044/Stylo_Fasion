import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    metal: {
      type: String,
      required: true,
      trim: true
    },

    size: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    images: {
      type: [String], 
      validate: {
        validator: function (v) {
          return v.length >= 3;
        },
        message: "Minimum 3 images required"
      }
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


variantSchema.index(
  { productId: 1, metal: 1, size: 1 },
  { unique: true }
);

const Variant = mongoose.model("Variant", variantSchema);

export default Variant;
