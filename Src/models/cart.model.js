import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  sku: {
    type: String, 
    required: true
  },
  metal: String,
  size: Number,
  price: Number, 
  quantity: {
    type: Number,
    default:1
  },
  total: Number
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);